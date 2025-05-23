import Logo from "@/components/custom/logo";
import { Markdown } from "@/components/custom/markdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatContext } from "@/contexts/chat-context";
import { clamp, cn, getAbbreviatedName } from "@/lib/utils";
import { Message } from "@/types/chats.types";
import { Session } from "next-auth";
import { useEffect, useRef } from "react";

export function ChatBubble({
  user,
  message,
  index,
  className,
}: {
  user: Session["user"];
  message: Message;
  index?: number;
  className?: string;
}) {
  const { messageGenerating, messageLoading, messages } = useChatContext();
  const scrollToViewElementRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (scrollToViewElementRef.current && messages.length - 1 === index && message.role === "user" && messageLoading)
      scrollToViewElementRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [scrollToViewElementRef, messages, messageGenerating, messageLoading]);

  if (message.role !== "user" && message.role !== "assistant") return;

  return (
    <section
      style={{ "--animate-delay": `${index ? clamp(index * 50, 0, 500) : 0}ms` } as React.CSSProperties}
      className={cn(
        "flex flex-row gap-3 w-fit max-w-3/4",
        "animation-from-translate-y-16 animation-to-translate-y-0 animation-from-opacity-0 animation-to-opacity-100 animation-from-scale-90 animation-to-scale-100 animate-enter fill-mode-forwards delay-(--animate-delay)",
        message.role === "user" && "flex-row-reverse place-self-end flex-none",
        message.role === "assistant" && messages.length - 1 === index && messageGenerating && "flex-1",
        className
      )}
    >
      <Avatar className={cn("hidden rounded flex-none", message.role === "user" && "block")}>
        <AvatarImage src={user.image ?? undefined} />
        <AvatarFallback>{getAbbreviatedName(user.name ?? undefined)}</AvatarFallback>
      </Avatar>
      <Logo
        variant="ghost"
        size="icon"
        className={cn("hidden flex-none [&_svg]:size-5", message.role === "assistant" && "inline")}
      />
      <section
        className={cn("rounded px-3 py-1 prose-sm flex-1 overflow-hidden", message.role === "user" && "py-2 bg-muted")}
      >
        {message.role === "user" ? <p className="whitespace-pre-wrap">{message.content}</p> : <Markdown>{message.content}</Markdown>}
      </section>
      <section ref={scrollToViewElementRef} />
    </section>
  );
}
