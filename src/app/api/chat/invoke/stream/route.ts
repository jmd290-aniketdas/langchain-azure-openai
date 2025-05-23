"use server";

import { auth } from "@/auth";
import { GPT_MODELS_LANGCHAIN_MAP } from "@/lib/langchain";
import { ChatRequest } from "@/types/chats.types";
import { ChatMessage } from "@langchain/core/messages";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if(!session)
      throw new Error("Not Authenticated");
    
    const requestData: ChatRequest = await req.json();
    if (
      !requestData.messages ||
      requestData.messages.length === 0 ||
      !requestData.modelName
    )
      throw new Error("No Model Name or Messaged was passed");

    const chatModel = GPT_MODELS_LANGCHAIN_MAP.find(
      (model) => model.name === requestData.modelName
    )?.model;
    if (!chatModel)
      throw new Error("No Model found for name " + requestData.modelName);

    const requestMessages = requestData.messages.map(
      (message) => new ChatMessage(message.content, message.role)
    );
    const originalStream = await chatModel.stream(requestMessages);

    const transformedStream = new ReadableStream({
      async start(controller) {
        const reader = originalStream.getReader();
        const encoder = new TextEncoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunkString = JSON.stringify(value.toDict()) + "\n";
          controller.enqueue(encoder.encode(chunkString));
        }
        controller.close();
      },
    });

    return new NextResponse(transformedStream, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
