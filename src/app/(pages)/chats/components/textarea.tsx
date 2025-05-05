"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useChatContext } from "@/contexts/chat-context";
import { useFilesContext } from "@/contexts/files-context";
import { cn } from "@/lib/utils";
import { File, Folder, Globe, SendHorizontal, Stars } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { KeyboardEventHandler, MouseEventHandler, useEffect, useRef } from "react";
import { toast } from "sonner";

export function Textarea({ className, ...props }: Omit<React.ComponentProps<"textarea">, "ref">) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendChat, generateNewChat } = useChatContext();
  const { status: sessionStatus } = useSession();
  const { chatId: paramsChatId }: { chatId: string } = useParams();

  const onSendButtonClicked: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    sendChatMessage();
  };
  const onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      sendChatMessage();
    }
  };
  const sendChatMessage = () => {
    if (!textareaRef.current || !textareaRef.current.value.trim()) {
      toast.error("Enter your question");
      textareaRef.current?.focus();
      return;
    }

    textareaRef.current?.blur();
    const value = textareaRef.current.value;
    if(paramsChatId)
      sendChat(value);
    else
      generateNewChat(value);
    textareaRef.current.value = "";
  };
  return (
    <div
      className={cn(
        "sticky bottom-0 w-full max-h-48 min-h-32 flex flex-col gap-1 px-4 py-3 rounded-t-xl border border-b-0 focus-within:border-ring transition-colors cursor-text bg-muted/60 backdrop-blur-xl shadow overflow-hidden",
        className
      )}
      onClick={() => textareaRef.current?.focus()}
    >
      <section className="flex gap-2">
        <Stars className="size-5 stroke-1 my-0.5 flex-none" />
        <textarea
          ref={textareaRef}
          className="h-16 focus:h-32 transition-[height] ease-in-out delay-100 duration-500 bg-transparent border-none outline-none text-wrap field-sizing-content resize-none overflow-y-auto overflow-x-hidden size-full disabled:cursor-not-allowed disabled:opacity-50 text-sm scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
          placeholder="Ask Questions"
          onKeyDown={onKeyDown}
          {...props}
        />
      </section>
      <section className="flex items-center justify-between gap-2">
        <section className="flex gap-2 items-center">
          <SelectFolder />
          <SelectFile />
          <WebSearchToggle />
        </section>
        <Button
          size="icon"
          className="rounded-full"
          onClick={onSendButtonClicked}
          disabled={sessionStatus === "unauthenticated" || sessionStatus === "loading"}
        >
          <SendHorizontal className="ml-0.5 size-5" />
        </Button>
      </section>
    </div>
  );
}

function SelectFolder() {
  const { selectedFolder, setSelectedFolder, folders, loading } = useFilesContext();
  const { status: sessionStatus } = useSession();

  return (
    <Select
      disabled={sessionStatus === "unauthenticated" || sessionStatus === "loading" || loading}
      value={selectedFolder}
      onValueChange={setSelectedFolder}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <SelectTrigger className="w-18 md:w-32">
            <SelectValue
              placeholder={
                <>
                  <Folder />
                  Folder
                </>
              }
              className="truncate text-sm"
            >
              <Folder />
              <p className="truncate hidden md:inline">
                {folders
                  .find((f) => f.name === selectedFolder)
                  ?.name.split("/")
                  .filter(Boolean)
                  .at(-1)}
              </p>
            </SelectValue>
          </SelectTrigger>
        </TooltipTrigger>
        <TooltipContent>
          {selectedFolder
            ? folders
                .find((f) => f.name === selectedFolder)
                ?.name.split("/")
                .filter(Boolean)
                .at(-1)
            : "Select Folder"}
        </TooltipContent>
      </Tooltip>
      <SelectContent>
        {folders.length === 0 && (
          <SelectItem value="." disabled>
            No Folders Found
          </SelectItem>
        )}
        {folders.map((f, i) => {
          const folderName = f.name.split("/").filter(Boolean).at(-1);
          return (
            <SelectItem key={i} value={f.name}>
              <section className="flex flex-col">
                <p className="text-sm">{folderName}</p>
                <p className="text-xs font-light text-muted-foreground">{f.name}</p>
              </section>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

function SelectFile() {
  const { selectedFile, setSelectedFile, files, loading } = useFilesContext();
  const { status: sessionStatus } = useSession();
  return (
    <Select
      disabled={sessionStatus === "unauthenticated" || sessionStatus === "loading" || loading}
      value={selectedFile}
      onValueChange={setSelectedFile}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <SelectTrigger className="w-18 md:w-32">
            <SelectValue
              placeholder={
                <>
                  <File />
                  File
                </>
              }
              className="truncate text-sm"
            >
              <File />
              <p className="truncate hidden md:inline">
                {files
                  .find((f) => f.name === selectedFile)
                  ?.name.split("/")
                  .filter(Boolean)
                  .at(-1)}
              </p>
            </SelectValue>
          </SelectTrigger>
        </TooltipTrigger>
        <TooltipContent>
          {selectedFile
            ? files
                .find((f) => f.name === selectedFile)
                ?.name.split("/")
                .filter(Boolean)
                .at(-1)
            : "Select File"}
        </TooltipContent>
      </Tooltip>
      <SelectContent>
        {files.length === 0 && (
          <SelectItem value="." disabled>
            No Files Found
          </SelectItem>
        )}
        {files.map((f, i) => {
          const fileName = f.name.split("/").filter(Boolean).at(-1);
          return (
            <SelectItem key={i} value={f.name}>
              <section className="flex flex-col">
                <p className="text-sm">{fileName}</p>
                <p className="text-xs font-light text-muted-foreground">{f.name}</p>
              </section>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

function WebSearchToggle() {
  const { isWebSearchOn, setIsWebSearchOn } = useChatContext();
  const { status: sessionStatus } = useSession();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toggle
          className="rounded-full border aria-pressed:bg-primary aria-pressed:text-primary-foreground"
          size="icon"
          disabled={sessionStatus === "unauthenticated" || sessionStatus === "loading"}
          pressed={isWebSearchOn}
          onPressedChange={setIsWebSearchOn}
          onSelect={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <Globe />
        </Toggle>
      </TooltipTrigger>
      <TooltipContent>Web Search: {isWebSearchOn ? "On" : "Off"}</TooltipContent>
    </Tooltip>
  );
}
