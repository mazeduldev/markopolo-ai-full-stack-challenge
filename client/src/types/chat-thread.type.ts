export type ChatThread = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  messages?: ChatMessage[];
};

export type ChatMessage = {
  id: string;
  role: MessageRole;
  content: string;
  created_at: string;
  updated_at: string;
  thread_id: string;
  user_id: string;
};

export enum MessageRole {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
}
