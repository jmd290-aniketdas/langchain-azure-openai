"use client";

import Logo from "@/components/custom/logo";
import { useChatContext } from "@/contexts/chat-context";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import { ChatBubble } from "./chat-bubble";

export function ChatDisplay({ user, className }: { user: Session["user"]; className?: string }) {
  const { messages } = useChatContext();

  return (
    <div className={cn("w-full px-1 md:px-3 flex flex-col gap-3", className)}>
      {messages.length === 0 && (
        <>
          <div className="flex-1 place-content-center place-items-center space-y-1">
            <span className="flex flex-col md:flex-row gap-1 md:gap-2 items-center -ml-10">
              <Logo variant="ghost" size="lg" />
              <h1 className="text-4xl font-medium tracking-tight text-center">Welcome, {user.name}!</h1>
            </span>
            <p className="text-sm font-light tracking-wide text-center">How can I help you today?</p>
          </div>
        </>
      )}
      {messages.map((message, i) => (
        <ChatBubble message={message} user={user} key={i} />
      ))}
    </div>
  );
}
