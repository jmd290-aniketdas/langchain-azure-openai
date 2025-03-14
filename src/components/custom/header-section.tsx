import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

export function HeaderSection({
  header,
  className,
  children,
}: {
  header: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className={cn("space-y-4", className)}>
      <section className="space-y-1">
        <h2 className="text tracking-wider text-muted-foreground">{header}</h2>
        <Separator />
      </section>
      {children}
    </section>
  );
}
