import { Skeleton } from "@/components/ui/skeleton";
import { clamp, cn } from "@/lib/utils";

export function ChatBubbleSkeleton({
  className,
  side = "left",
  size = "sm",
  index,
}: {
  className?: string;
  side?: "left" | "right";
  size?: "sm" | "lg";
  index?: number;
}) {
  return (
    <section
      style={
        {
          "--animate-delay": `${index ? clamp(index * 133.33, 0, 1333.3) : 0}ms`,
        } as React.CSSProperties
      }
      className={cn(
        "flex flex-row gap-3 w-full md:max-w-3/4",
        "animation-from-translate-y-16 animation-via-translate-0 -animation-to-translate-y-4 animation-from-opacity-0 animation-via-opacity-100 animation-to-opacity-0 animation-from-scale-90 animation-via-scale-100 animation-to-scale-75 animate-enter-delayed-exit ease-in-out repeat-infinite delay-(--animate-delay)",
        side === "right" && "flex-row-reverse place-self-end",
        className
      )}
    >
      <Skeleton className="size-8 aspect-square" />
      <Skeleton className={cn("w-full max-w-96 aspect-square", size === "sm" && "h-10", size === "lg" && "h-24")} />
    </section>
  );
}
