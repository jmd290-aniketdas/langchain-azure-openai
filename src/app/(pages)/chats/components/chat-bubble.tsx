import Logo from "@/components/custom/logo";
import { Markdown } from "@/components/custom/markdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { clamp, cn, getAbbreviatedName } from "@/lib/utils";
import { Message } from "@/types/chats.types";
import { Session } from "next-auth";

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
  if (message.role !== "user" && message.role !== "assistant") return;

  return (
    <section
      style={{ "--animate-delay": `${index ? clamp(index * 50, 0, 500) : 0}ms` } as React.CSSProperties}
      className={cn(
        "flex flex-row gap-3 w-fit md:max-w-3/4",
        "animation-from-translate-y-16 animation-to-translate-y-0 animation-from-opacity-0 animation-to-opacity-100 animation-from-scale-90 animation-to-scale-100 animate-enter fill-mode-forwards delay-(--animate-delay)",
        message.role === "user" && "flex-row-reverse place-self-end",
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
        className={cn(
          "rounded px-3 py-1 prose-sm flex-1 overflow-hidden",
          "[&_*]:animate-enter [&_*]:fill-mode-forwards [&_*]:delay-150 [&_*]:duration-100 [&_*]:animation-from-translate-y-8 [&_*]:animation-to-translate-y-0 [&_*]:animation-from-opacity-0 [&_*]:animation-to-opacity-100",
          message.role === "user" && "py-2 bg-muted text-end"
        )}
      >
        <Markdown>{message.content}</Markdown>
      </section>
    </section>
  );
}
