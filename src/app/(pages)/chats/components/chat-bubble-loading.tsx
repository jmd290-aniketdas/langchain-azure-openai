import Logo from "@/components/custom/logo";
import { useChatContext } from "@/contexts/chat-context";
import { cn } from "@/lib/utils";

export function ChatBubbleLoading({ className }: { className?: string }) {
  const { messageLoading } = useChatContext();
  return (
    <section
      className={cn(
        "flex flex-row gap-3 w-fit md:max-w-3/4",
        "animate-enter fill-mode-forwards delay-(--animate-delay)",
        "animation-from-translate-y-16 animation-to-translate-y-0 animation-from-opacity-0 animation-to-opacity-100 animation-from-scale-90 animation-to-scale-100",
        messageLoading && "flex-1 h-full",
        className
      )}
    >
      <Logo variant="ghost" size="icon" className="flex-none [&_svg]:size-5" />
      <section className="rounded px-3 py-1 prose-sm flex-1 overflow-hidden flex">
        <p className="animate-pulse">Generating...</p>
      </section>
    </section>
  );
}
