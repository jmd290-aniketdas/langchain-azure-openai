"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback } from "react";
import { Button, ButtonProps } from "../ui/button";

export const ThemeToggle = ({
  className,
  variant = "outline",
  ...props
}: Omit<ButtonProps, "size">) => {
  const { setTheme } = useTheme();
  const toggleTheme = useCallback(() => {
    setTheme((theme) => (theme === "light" ? "dark" : "light"));
  }, [setTheme]);
  return (
    <Button
      variant={variant}
      size="icon"
      className={className}
      onClick={toggleTheme}
      {...props}
    >
      <Sun className="absolute rotate-90 scale-0 transition-all light:-rotate-0 light:scale-100" />
      <Moon className="absolute rotate-0 scale-100 transition-all light:-rotate-90 light:scale-0" />
    </Button>
  );
};
