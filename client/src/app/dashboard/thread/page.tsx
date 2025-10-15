"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Bot, MessagesSquare } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/context/user-context";
import { Campaign } from "@/types/campaign.type";
import {
  ChatMessage,
  ChatThread,
  MessageRole,
  StreamMessage,
} from "@/types/chat-thread.type";
import { CampaignView } from "@/components/chat-history/CampaignView";
import { PageHeader } from "@/components/custom-ui/PageHeader";

// A component to display while the client component is loading
function ThreadPageSkeleton() {
  return (
    <div className="p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Loading Thread...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ThreadPageContent() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const threadId = searchParams.get("id");
  console.log("Thread ID from URL:", threadId);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(
    threadId,
  );
  console.log("Current Thread ID:", currentThreadId);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch thread history if threadId exists
  const { data: threadData, isLoading } = useQuery({
    queryKey: ["thread", threadId],
    queryFn: async (): Promise<ChatThread> => {
      if (!threadId) throw new Error("No thread ID");
      const response = await fetch(`/api/chat/threads/${threadId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch thread");
      }
      return response.json();
    },
    enabled: !!threadId,
  });

  // Load messages from thread data
  useEffect(() => {
    if (threadData?.messages) {
      setMessages(threadData.messages ?? []);
    }
  }, [threadData]);

  // Clear messages for new thread
  useEffect(() => {
    if (!threadId) {
      setMessages([]);
    }
    setCurrentThreadId(threadId);
  }, [threadId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isStreaming) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      content: currentMessage,
      created_at: new Date().toISOString(),
      thread_id: currentThreadId,
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentMessage("");
    setIsStreaming(true);
    setStreamingContent("");

    try {
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: currentMessage,
          thread_id: currentThreadId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data: StreamMessage = JSON.parse(line.slice(6)); // Remove "data: " prefix

              // Update thread ID and URL on first chunk
              if (data.threadId && !currentThreadId) {
                queryClient.setQueryData(
                  ["threads"],
                  (oldData: ChatThread[]) => {
                    if (!oldData) return oldData;
                    return [
                      {
                        id: data.threadId,
                        title: userMessage.content.substring(0, 50),
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                        user_id: user?.id,
                      },
                      ...oldData,
                    ];
                  },
                );

                setCurrentThreadId(data.threadId);
                router.push(`/dashboard/thread?id=${data.threadId}`, {
                  scroll: false,
                });
              }

              fullContent += data.chunk;
              setStreamingContent(fullContent);
            } catch (e) {
              // Skip invalid JSON
              console.log("Skipping invalid JSON chunk", e);
            }
          }
        }
      }

      // Add the complete assistant message
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: MessageRole.ASSISTANT,
        content: fullContent,
        created_at: new Date().toISOString(),
        thread_id: currentThreadId,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingContent("");
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove the user message on error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.role === "user";
    let campaign: Campaign | null = null;

    try {
      if (!isUser) {
        campaign = JSON.parse(message.content) as Campaign;
      }
    } catch {
      campaign = null;
    }

    return (
      <div
        key={message.id}
        className={`flex gap-3 mb-4 ${
          isUser ? "justify-end" : "justify-start"
        }`}
      >
        {!isUser && (
          <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
        )}

        <div className={`max-w-[85%] ${isUser ? "order-first" : ""}`}>
          <Card className={isUser ? "bg-blue-500 text-white" : ""}>
            <CardContent className="px-4">
              {isUser ? (
                <p className="text-sm leading-relaxed">{message.content}</p>
              ) : (
                <div className="text-sm">
                  {campaign ? (
                    <CampaignView campaign={campaign} />
                  ) : (
                    <p className="leading-relaxed">{message.content}</p>
                  )}
                </div>
              )}
              <p
                className={`text-xs mt-3 ${
                  isUser ? "text-blue-100" : "text-muted-foreground"
                }`}
              >
                {new Date(message.created_at).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {isUser && (
          <div className="flex-shrink-0 w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div>Loading thread...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full space-y-6">
      {/* Header */}
      <PageHeader
        icon={MessagesSquare}
        title={threadData?.title || "New Chat"}
      />

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 border rounded-xl h-[500]">
        {messages.length === 0 && !isStreaming && (
          <div className="text-center text-muted-foreground mt-12">
            <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h2 className="text-lg font-medium mb-2">Start a conversation</h2>
            <p>Ask me to generate a marketing campaign for your product!</p>
          </div>
        )}

        {messages.map(renderMessage)}

        {/* AI Thinking indicator */}
        {isStreaming && !streamingContent && (
          <div className="flex gap-3 mb-4 justify-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="max-w-[85%]">
              <Card>
                <CardContent className="px-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Thinking</span>
                    <div className="flex gap-1">
                      <div
                        className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Streaming message */}
        {isStreaming && streamingContent && (
          <div className="flex gap-3 mb-4 justify-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="max-w-[85%]">
              <Card>
                <CardContent className="px-4">
                  <div className="text-sm">
                    <p className="leading-relaxed">{streamingContent}</p>
                    <div className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input */}
      <div className="bg-background">
        <div className="flex gap-2">
          <Textarea
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your product and I'll generate a marketing campaign..."
            className="flex-1 min-h-[60px] max-h-[120px] resize-none"
            disabled={isStreaming}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!currentMessage.trim() || isStreaming}
            size="lg"
            className="h-auto px-6"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

export default function ThreadPage() {
  return (
    <Suspense fallback={<ThreadPageSkeleton />}>
      <ThreadPageContent />
    </Suspense>
  );
}
