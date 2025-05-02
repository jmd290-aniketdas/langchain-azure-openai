type ChatRequest = {
  messages: Message[];
  modelName: string;
};

type Message = {
  role: MessageType;
  content: string;
};

type MessageType =
  | "system"
  | "assistant"
  | "user"
  | "function"
  | "tool"
  | "developer";

type ChatInfo = {
  chatId: string;
  chatTitle: string;
  messages: Message[];
};

export { type ChatRequest, type Message, type MessageType, type ChatInfo };
