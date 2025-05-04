import Logo from "@/components/custom/logo";
import { Markdown } from "@/components/custom/markdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getAbbreviatedName } from "@/lib/utils";
import { Message } from "@/types/chats.types";
import { Session } from "next-auth";

export function ChatBubble({ user, message, className }: { user: Session["user"]; message: Message; className?: string }) {
  if (message.role !== "user" && message.role !== "assistant") return;

  return (
    <section
      className={cn(
        "flex flex-row gap-3 w-fit md:max-w-3/4",
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
        className={cn("hidden rounded bg-accent flex-none", message.role === "assistant" && "inline")}
      />
      <section
        className={cn("rounded px-3 py-1 prose-sm flex-1 overflow-hidden", message.role === "user" && "py-2 bg-muted text-end")}
      >
        <Markdown>{message.content}</Markdown>
      </section>
    </section>
  );
}
