"use server";

import { GPT_MODELS_LANGCHAIN_MAP } from "@/lib/langchain";
import { prisma } from "@/lib/prisma";
import { ChatInfo, Message } from "@/types/chats.types";
import { ChatMessage } from "@langchain/core/messages";

async function createNewChat(email: string) {
  "use server";
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  const newChat = await prisma.chat.create({ data: { userId: user.id } });
  if (!newChat) throw new Error("New Chat was not created");

  return newChat;
}

async function chatInvoke(modelName: string, messages: Message[]) {
  "use server";
  if (!messages || messages.length === 0 || !modelName) throw new Error("No Model Name or Messaged was passed");

  const chatModel = GPT_MODELS_LANGCHAIN_MAP.find((model) => model.name === modelName)?.model;
  if (!chatModel) throw new Error("No Model found for name " + modelName);

  const requestMessages = messages.map((message) => new ChatMessage(message.content, message.role));
  const _res = await chatModel.invoke(requestMessages);
  const res = _res.toDict();

  return res;
}

async function updateChatTitle(chatId: string, chatTitle: string) {
  "use server";
  const chat = await prisma.chat.findUnique({ where: { id: chatId } });
  if (!chat) throw new Error("No chat found with ID " + chatId);
  const updChat = await prisma.chat.update({
    where: { id: chatId },
    data: { title: chatTitle },
  });
  if (!updChat) throw new Error("Cannot update Chat Title");
  return updChat;
}

async function createNewMessage(chatId: string, message: Message) {
  "use server";
  const newMessage = await prisma.message.create({
    data: {
      chatId,
      role: message.role,
      content: message.content,
    },
  });
  if (!newMessage) throw new Error("Cannot create message");
  return newMessage;
}

async function fetchChatInfo(chatId: string): Promise<ChatInfo> {
  "use server";
  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  if (!chat) throw new Error("No chat found with ID " + chatId);

  const chatInfo: ChatInfo = {
    chatId: chat.id,
    chatTitle: chat.title,
    messages: chat.messages.map((m) => ({ role: m.role, content: m.content })),
  };
  return chatInfo;
}

async function fetchChatTitle(chatId: string): Promise<string> {
  "use server";
  const chat = await prisma.chat.findUnique({ where: { id: chatId } });
  if (!chat) throw new Error("No chat found with ID " + chatId);
  return chat.title;
}

async function fetchChatMessages(chatId: string): Promise<Message[]> {
  "use server";
  const messages = await prisma.message.findMany({ where: { chatId }, orderBy: { createdAt: "asc" } });
  if (!messages) throw new Error("No Messages found for Chat ID " + chatId);
  return messages.map((m) => ({ role: m.role, content: m.content }));
}

export { createNewChat, chatInvoke, updateChatTitle, createNewMessage, fetchChatInfo, fetchChatTitle, fetchChatMessages };
