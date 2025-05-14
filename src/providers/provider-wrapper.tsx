"use client";

import { ChatProvider } from "@/contexts/chat-context";
import { FilesProvider } from "@/contexts/files-context";
import { ModelsProvider } from "@/contexts/models-context";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { TooltipProvider } from "../components/ui/tooltip";

export default function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const defaultMount: React.ReactNode = (
    <SessionProvider>
      <FilesProvider>
        <ModelsProvider>
          <ChatProvider>
            <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
          </ChatProvider>
        </ModelsProvider>
      </FilesProvider>
    </SessionProvider>
  );

  if (!mounted) return defaultMount;

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {defaultMount}
    </ThemeProvider>
  );
}
