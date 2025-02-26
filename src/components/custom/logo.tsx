"use client";

import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import GradientIcon from "./gradient-icon";

const Logo = ({ className }: { className?: string }) => {
  const { theme } = useTheme();
  return (
    <div
      className={cn("w-full aspect-square p-1 rounded bg-sidebar", className)}
    >
      <GradientIcon
        icon={Sparkles}
        className={cn(
          "bg-gradient-to-b",
          theme === "light" && "from-black to-muted-foreground",
          theme === "dark" && "from-white to-muted-foreground"
        )}
        strokeWidth={theme === "light" ? 2 : 1}
      />
    </div>
  );
};

export default Logo;
