"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeSwapper() {
  const { theme, setTheme } = useTheme();
  const [inputTheme, setInputTheme] = useState<boolean>(theme === "dark");
  useEffect(() => setTheme(inputTheme ? "dark" : "light"), [inputTheme]);

  return (
    <section className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Personalize your experience. <br />
        Switch between light and dark themes to match your mood or environment.
      </p>
      <section className="grid grid-cols-2 gap-2 items-center">
        <Label htmlFor="theme-switch">Change Theme</Label>
        <section className="flex items-center gap-4 text-xs place-self-center">
          <p
            className={cn(
              "text-muted transition-colors",
              theme === "light" && "text-muted-foreground"
            )}
          >
            Light
          </p>
          <Switch
            id="theme-switch"
            checked={inputTheme}
            onCheckedChange={setInputTheme}
          />
          <p
            className={cn(
              "text-muted transition-colors",
              theme === "dark" && "text-muted-foreground"
            )}
          >
            Dark
          </p>
        </section>
      </section>
    </section>
  );
}
