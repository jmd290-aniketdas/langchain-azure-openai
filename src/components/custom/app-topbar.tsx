"use client";

import { useChatContext } from "@/contexts/chat-context";
import { useModelsContext } from "@/contexts/models-context";
import { CHATS_ROOT_LINK } from "@/lib/consts";
import { cn } from "@/lib/utils";
import { GPTModelCatalog } from "@/types/models.types";
import { Calendar, Stars } from "lucide-react";
import { usePathname } from "next/navigation";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { SidebarTrigger } from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function AppTopbar({ className }: { className?: string }) {
  const { availableModels, selectedModel, setSelectedModel, selectedModelLoading } = useModelsContext();
  const { currentChatTitle, currentChatContextLoading } = useChatContext();
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "sticky top-0 flex shrink-0 items-center justify-between gap-2 border-b bg-sidebar/40 backdrop-blur-xl p-4 h-(--header-height) z-50",
        className
      )}
    >
      <section className="flex gap-4 items-center h-full w-full max-w-1/2">
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarTrigger />
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle Sidebar</p>
          </TooltipContent>
        </Tooltip>

        {pathname.includes(CHATS_ROOT_LINK) && (
          <>
            <hr className="w-px h-full bg-muted-foreground" />
            {currentChatContextLoading ? (
              <Skeleton className="size-full max-w-48" />
            ) : (
              <p className="text-sm text-muted-foreground whitespace-nowrap truncate">
                {currentChatTitle ? currentChatTitle : "New Chat"}
              </p>
            )}
          </>
        )}
      </section>

      {pathname.includes(CHATS_ROOT_LINK) && (
        <>
          {selectedModelLoading ? (
            <Skeleton className="h-9 w-42" />
          ) : (
            <Select value={selectedModel} onValueChange={(val) => setSelectedModel(val)}>
              <SelectTrigger className="border-none bg-transparent w-42" disabled={selectedModelLoading}>
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                {!selectedModelLoading &&
                  availableModels.map((model, i) => (
                    <HoverCard key={i} openDelay={0} closeDelay={0}>
                      <HoverCardTrigger asChild>
                        <SelectItem value={model.name} disabled={!model.available}>
                          <Stars />
                          <p>{model.formalName}</p>
                        </SelectItem>
                      </HoverCardTrigger>
                      <ModelHoverCardContent modelInfo={model} side="left" />
                    </HoverCard>
                  ))}
              </SelectContent>
            </Select>
          )}
        </>
      )}
    </header>
  );
}

function ModelHoverCardContent({
  modelInfo,
  className,
  ...props
}: { modelInfo: GPTModelCatalog } & React.ComponentProps<typeof HoverCardContent>) {
  return (
    <HoverCardContent className={cn("grid grid-cols-3 grid-rows-2 gap-2 p-2 min-w-96", className)} {...props}>
      <section className="row-span-full bg-accent rounded shadow flex flex-col items-center justify-center gap-2 py-3 px-1">
        <Stars className="size-12 stroke-1 stroke-accent-foreground" />
        <section className="text-center">
          <p className="text-sm font-medium">{modelInfo.formalName}</p>
          <p className="text-muted-foreground text-xs font-light">{modelInfo.footer}</p>
        </section>
      </section>

      <section className="col-span-2 row-span-full grid grid-rows-subgrid items-center">
        <p className="text-xs font-light">{modelInfo.description}</p>
        <section className="flex gap-2 items-center">
          <Calendar className="size-4" />
          <p className="text-xs">{modelInfo.date}</p>
        </section>
      </section>
    </HoverCardContent>
  );
}
