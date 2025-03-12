"use client";

import { cn } from "@/lib/utils";
import { BrainCircuit } from "lucide-react";
import { useTheme } from "next-themes";
import GradientIcon from "./gradient-icon";

const Logo = ({ className }: { className?: string }) => {
  const { theme } = useTheme();
  return (
    <div
      className={cn(
        "w-full aspect-square p-1 rounded bg-sidebar-primary",
        className
      )}
    >
      <GradientIcon icon={BrainCircuit} strokeWidth={2} />
    </div>
  );
};

export default Logo;
