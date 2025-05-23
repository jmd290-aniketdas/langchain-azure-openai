"use client";

import Logo from "@/components/custom/logo";
import { useChatContext } from "@/contexts/chat-context";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import { ChatBubble } from "./chat-bubble";
import { ChatBubbleLoading } from "./chat-bubble-loading";
import { ChatBubbleSkeleton } from "./chat-bubble-skeleton";

export function ChatDisplay({ user, className }: { user: Session["user"]; className?: string }) {
  const { currentChatContextLoading, messages, messageLoading } = useChatContext();

  return (
    <div
      className={cn(
        "w-full h-full px-1 md:px-3 flex flex-col gap-3 overflow-auto",
        "animate-enter fill-mode-forwards delay-1000 duration-500 animation-from-translate-y-8 animation-to-translate-y-0 animation-from-opacity-0 animation-to-opacity-100",
        className
      )}
    >
      {currentChatContextLoading &&
        Array(8)
          .fill(0)
          .map((_, i) => (
            <ChatBubbleSkeleton key={i} side={i % 2 === 0 ? "right" : "left"} size={i % 2 === 0 ? "sm" : "lg"} index={i} />
          ))}
      {!currentChatContextLoading && messages.length === 0 && (
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
      {!currentChatContextLoading &&
        messages.map((message, i) => <ChatBubble message={message} user={user} index={i} key={i} />)}
      {!currentChatContextLoading && messageLoading && <ChatBubbleLoading />}
    </div>
  );
}
