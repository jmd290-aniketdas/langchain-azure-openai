"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";
import { TooltipProvider } from "../ui/tooltip";

export default function ProvidersWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted)
    return (
      <SessionProvider>
        <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
      </SessionProvider>
    );

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <SessionProvider>
        <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
