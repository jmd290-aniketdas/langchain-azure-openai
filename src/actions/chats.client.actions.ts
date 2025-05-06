"use client";

import { Message } from "@/types/chats.types";
import { StoredMessage } from "@langchain/core/messages";

async function* chatStream(model: string, messages: Message[]) {
  const res = await fetch("/api/chat/invoke/stream", {
    method: "POST",
    body: JSON.stringify({ modelName: model, messages }),
  });
  if (!res.body) throw new Error("No stream.");
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop()!;
    for (let line of lines.filter(Boolean)) {
      yield JSON.parse(line) as StoredMessage;
    }
  }
}

export { chatStream };
