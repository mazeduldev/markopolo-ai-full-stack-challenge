"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  User,
  Bot,
  Calendar,
  DollarSign,
  Users,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { ViewJsonDialog } from "@/components/chat-history/ViewJsonDialog";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/context/user-context";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  thread_id?: string | null;
  campaign_id?: string | null;
}

interface ChatThread {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  messages: ChatMessage[];
}

interface StreamMessage {
  threadId: string;
  chunk: string;
}

interface Campaign {
  campaign_title: string;
  target_audience: string;
  message: {
    headline: string;
    body: string;
    call_to_action?: {
      label: string;
      url: string;
    };
  };
  channels: string[];
  timeline: {
    start_date: string;
    end_date: string;
  };
  budget: string;
  expected_metrics: {
    open_rate: number;
    click_rate: number;
    conversion_rate: number;
    roi: number;
  };
}

export default function ThreadPage() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const threadId = searchParams.get("id");

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(
    threadId,
  );

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
      setMessages(threadData.messages);
    }
  }, [threadData]);

  // Clear messages for new thread
  useEffect(() => {
    if (!threadId) {
      setMessages([]);
      setCurrentThreadId(null);
    }
  }, [threadId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isStreaming) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
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
          threadId: currentThreadId,
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
              const data: StreamMessage = JSON.parse(line.slice(6));

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
            }
          }
        }
      }

      // Add the complete assistant message
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: fullContent,
        created_at: new Date().toISOString(),
        thread_id: currentThreadId || "",
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

  const renderCampaign = (campaign: Campaign) => {
    return (
      <Card className="mt-3">
        <CardHeader>
          <div className="flex w-full justify-between items-center gap-2">
            <Badge variant="default">Campaign</Badge>
            <ViewJsonDialog campaign={campaign} />
          </div>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg flex items-center">
              {campaign.campaign_title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-1 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Target Audience
            </h4>
            <p className="text-sm text-muted-foreground">
              {campaign.target_audience}
            </p>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Message
            </h4>
            <div className="space-y-2">
              <p className="font-medium text-sm">{campaign.message.headline}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {campaign.message.body}
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <div>
                <span className="font-medium">Budget:</span>
                <p>{campaign.budget}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <div>
                <span className="font-medium">Timeline:</span>
                <p>
                  {new Date(campaign.timeline.start_date).toLocaleDateString()}{" "}
                  - {new Date(campaign.timeline.end_date).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div>
              <span className="font-medium">Channels:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {campaign.channels.map((channel) => (
                  <Badge key={channel} variant="outline" className="text-xs">
                    {channel}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Expected Metrics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Open Rate:</span>
                <p className="font-medium">
                  {campaign.expected_metrics.open_rate}%
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Click Rate:</span>
                <p className="font-medium">
                  {campaign.expected_metrics.click_rate}%
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Conversion:</span>
                <p className="font-medium">
                  {campaign.expected_metrics.conversion_rate}%
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">ROI:</span>
                <p className="font-medium">{campaign.expected_metrics.roi}x</p>
              </div>
            </div>
          </div>

          {campaign.message.call_to_action && (
            <Button asChild className="w-full">
              <a
                href={campaign.message.call_to_action.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                {campaign.message.call_to_action.label}
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderMessage = (message: ChatMessage) => {
    const isUser = message.role === "user";

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
            <CardContent className="p-4">
              {isUser ? (
                <p className="text-sm leading-relaxed">{message.content}</p>
              ) : (
                <div className="text-sm">
                  {(() => {
                    try {
                      const campaign: Campaign = JSON.parse(message.content);
                      return renderCampaign(campaign);
                    } catch {
                      return (
                        <p className="leading-relaxed">{message.content}</p>
                      );
                    }
                  })()}
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
    <div className="flex flex-col h-screen max-h-screen">
      {/* Header */}
      <div className="border-b p-4 bg-background">
        <h1 className="text-xl font-semibold">
          {threadData?.title || "New Chat"}
        </h1>
        {threadData?.created_at && (
          <p className="text-sm text-muted-foreground">
            Created {new Date(threadData.created_at).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 && !isStreaming && (
          <div className="text-center text-muted-foreground mt-12">
            <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h2 className="text-lg font-medium mb-2">Start a conversation</h2>
            <p>Ask me to generate a marketing campaign for your product!</p>
          </div>
        )}

        {messages.map(renderMessage)}

        {/* Streaming message */}
        {isStreaming && streamingContent && (
          <div className="flex gap-3 mb-4 justify-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="max-w-[85%]">
              <Card>
                <CardContent className="p-4">
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
      <div className="border-t p-4 bg-background">
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
            className="h-[60px] px-6"
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
