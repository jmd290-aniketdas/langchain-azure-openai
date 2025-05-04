type ChatRequest = {
  messages: Message[];
  modelName: string;
};

type Message = {
  role: MessageType;
  content: string;
};

type MessageType = "system" | "assistant" | "user" | "function" | "tool" | "developer";

type ChatInfo = {
  chatId: string;
  chatTitle: string;
  createdAt: Date;
  updatedAt: Date;
};

export { type ChatInfo, type ChatRequest, type Message, type MessageType };
