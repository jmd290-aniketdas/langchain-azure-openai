"use client";

import { EMPTY_STORED_MESSAGE } from "@/lib/consts";
import { Message } from "@/types/chats.types";
import { StoredMessage } from "@langchain/core/messages";
import { Dispatch, SetStateAction } from "react";

const sendChatStream = async ({
  modelName,
  messages,
  loadingSetter,
  streamingSetter,
  streamingTextSetter,
  responseSetter,
}: {
  modelName: string;
  messages: Message[];
  loadingSetter?: Dispatch<SetStateAction<boolean>>;
  streamingSetter?: Dispatch<SetStateAction<boolean>>;
  streamingTextSetter?: Dispatch<SetStateAction<string>>;
  responseSetter?: Dispatch<SetStateAction<StoredMessage>>;
}) => {
  loadingSetter && loadingSetter(true);
  streamingSetter && streamingSetter(true);

  const _res = await fetch("/api/chat/invoke/stream", {
    method: "POST",
    body: JSON.stringify({ messages, modelName }),
  });

  const reader = _res.body?.getReader();
  if (!reader) throw new Error("Reader undefined");
  const decoder = new TextDecoder();
  let result = "";

  const resultObject: StoredMessage = EMPTY_STORED_MESSAGE;

  while (true) {
    const { value, done } = await reader.read();
    loadingSetter && loadingSetter(false);
    if (done) break;

    if (value) {
      const buffer = decoder.decode(value, { stream: true });
      let parts = buffer.split("\n").filter(Boolean);
      for (let part of parts) {
        if (part.trim().length > 0) {
          const parsedResponse: StoredMessage = JSON.parse(part);
          if (parsedResponse.data.content)
            result += parsedResponse.data.content;

          resultObject.type = parsedResponse.type;
          resultObject.data = { ...parsedResponse.data, content: result };

          streamingTextSetter && streamingTextSetter(result);
        }
      }
    }
  }

  streamingSetter && streamingSetter(false);
  responseSetter && responseSetter(resultObject);

  return resultObject;
};

export { sendChatStream };
