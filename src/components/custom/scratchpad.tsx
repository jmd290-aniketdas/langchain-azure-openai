"use client";

import { useChatContext } from "@/contexts/chat-context";
import { cn } from "@/lib/utils";
import { Bot, Info } from "lucide-react";
import { useSession } from "next-auth/react";
import { KeyboardEventHandler, useState } from "react";
import { toast } from "sonner";
import { Separator } from "../ui/separator";
import { SidebarInput } from "../ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Markdown } from "./markdown";

export default function ScratchPad({ className }: { className?: string }) {
  const { status: sessionStatus } = useSession();

  const [input, setInput] = useState<string>("");
  const [focused, setFocused] = useState<boolean>(false);

  const {
    scratchpadTextStream,
    scratchpadTextResponse,
    scratchpadLoading,
    scratchpadStreaming,
    sendScratchpadChat,
  } = useChatContext();

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();

      sendScratchpadChat(input).catch((e) => {
        console.error(e);
        toast.error(e.message);
      });

      setInput("");
    }
  };

  return (
    <div className={cn("flex flex-col items-center", focused && "gap-2", className)}>
      <section
        className={cn(
          "relative flex prose-sm text-xs w-full bg-background rounded shadow transition-[color,opacity] ease-in-out delay-100 duration-500 opacity-0",
          !scratchpadTextStream && "text-muted-foreground",
          focused && "opacity-100",
          scratchpadLoading && "animate-pulse duration-1000 ease-out"
        )}
      >
        <section
          className={cn(
            "h-0 flex-1 transition-[height,padding] ease-in-out delay-100 duration-500 overflow-hidden scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent",
            focused && "p-2 h-64 overflow-auto"
          )}
        >
          {scratchpadTextStream ? (
            <Markdown>{scratchpadTextStream}</Markdown>
          ) : (
            <span className="flex items-center gap-2 text-xs">
              <Bot className="size-4 stroke-1" />
              Scratch here...
            </span>
          )}
        </section>
        {scratchpadTextResponse &&
          scratchpadTextResponse.data.response_metadata && (
            <Tooltip>
              <TooltipTrigger className="cursor-pointer absolute bottom-2 right-2">
                <Info className="size-4" />
              </TooltipTrigger>
              <TooltipContent>
                <section className="grid grid-cols-5 gap-1">
                  <p className="col-span-full font-medium">Completion</p>

                  <p className="col-span-4">Tokens used</p>
                  <p className="text-end">
                    {
                      scratchpadTextResponse.data.response_metadata?.usage
                        ?.completion_tokens
                    }
                  </p>
                  <p className="col-span-4">Audio Tokens</p>
                  <p className="text-end">
                    {
                      scratchpadTextResponse.data.response_metadata?.usage
                        ?.completion_tokens_details?.audio_tokens
                    }
                  </p>
                  <p className="col-span-4">Reasoning Tokens</p>
                  <p className="text-end">
                    {
                      scratchpadTextResponse.data.response_metadata?.usage
                        ?.completion_tokens_details?.audio_tokens
                    }
                  </p>
                  <p className="col-span-4">Accepted Prediction Tokens</p>
                  <p className="text-end">
                    {
                      scratchpadTextResponse.data.response_metadata?.usage
                        ?.completion_tokens_details?.accepted_prediction_tokens
                    }
                  </p>
                  <p className="col-span-4">Rejected Prediction Tokens</p>
                  <p className="text-end">
                    {
                      scratchpadTextResponse.data.response_metadata?.usage
                        ?.completion_tokens_details?.rejected_prediction_tokens
                    }
                  </p>

                  <Separator className="col-span-full bg-muted stroke-muted" />

                  <p className="col-span-full font-medium">Prompt</p>

                  <p className="col-span-4">Tokens used</p>
                  <p className="text-end">
                    {
                      scratchpadTextResponse.data.response_metadata?.usage
                        ?.prompt_tokens
                    }
                  </p>
                  <p className="col-span-4">Audio Tokens</p>
                  <p className="text-end">
                    {
                      scratchpadTextResponse.data.response_metadata?.usage
                        ?.prompt_tokens_details?.audio_tokens
                    }
                  </p>
                  <p className="col-span-4">Cached Tokens</p>
                  <p className="text-end">
                    {
                      scratchpadTextResponse.data.response_metadata?.usage
                        ?.prompt_tokens_details?.cached_tokens
                    }
                  </p>

                  <Separator className="col-span-full bg-muted stroke-muted" />

                  <p className="col-span-4 font-medium">Total</p>
                  <p className="text-end">
                    {
                      scratchpadTextResponse.data.response_metadata?.usage
                        ?.total_tokens
                    }
                  </p>
                </section>
              </TooltipContent>
            </Tooltip>
          )}
      </section>
      <SidebarInput
        className="flex-none w-full text-sm"
        placeholder="Scratchpad..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={
          sessionStatus === "loading" ||
          sessionStatus === "unauthenticated" ||
          scratchpadLoading ||
          scratchpadStreaming
        }
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}
