import { cn } from "@/lib/utils";
import { BrainCircuit } from "lucide-react";

const Logo = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "w-full aspect-square p-1 rounded bg-sidebar-primary",
        className
      )}
    >
      <BrainCircuit className="stroke-primary-foreground" />
    </div>
  );
};

export default Logo;
