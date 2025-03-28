"use client";

import { pasteFilesOrFoldersForUser } from "@/actions/files.actions";
import { ContextMenuItem } from "@/components/ui/context-menu";
import useLocalStorage from "@/hooks/use-local-storage";
import { copyToClipboard } from "@/lib/utils";
import { MinIOFile, MinIOFolder } from "@/types/files.types";
import { ClipboardCopy, ClipboardPaste } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function CopyContextMenuItem({
  info,
}: {
  info: MinIOFile | MinIOFolder;
}) {
  const [_, setCopiedValue] = useLocalStorage<string>("copied-value", "");
  const onCopy = () => {
    setCopiedValue(info.name);
    copyToClipboard(info.name).then(() =>
      toast.success(
        <span>
          Copied to clipboard
          <br />
          <code>{info.name}</code>
        </span>
      )
    );
  };
  return (
    <ContextMenuItem onSelect={() => onCopy()}>
      <ClipboardCopy />
      Copy
    </ContextMenuItem>
  );
}

export function PasteContextMenuItem({
  email,
  info,
}: {
  email: string;
  info: MinIOFile | MinIOFolder;
}) {
  const router = useRouter();
  const [copiedValue, _] = useLocalStorage<string>("copied-value", "");
  const _pasteItem = async () => {
    pasteFilesOrFoldersForUser(email, copiedValue, info.name)
      .then(() => toast.success("Successfully copied to destination"))
      .catch((error) => {
        console.error(error);
        toast.error(error.message);
      })
      .finally(() => router.refresh());
  };
  return (
    <ContextMenuItem disabled={!copiedValue} onSelect={() => _pasteItem()}>
      <ClipboardPaste />
      Paste
    </ContextMenuItem>
  );
}
