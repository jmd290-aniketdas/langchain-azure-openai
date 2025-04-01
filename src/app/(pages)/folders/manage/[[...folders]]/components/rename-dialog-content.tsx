"use client";

import { renameFileOrFolderForUser } from "@/actions/files.actions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MinIOFile, MinIOFolder } from "@/types/files.types";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export function RenameFolderDialogContent({
  folderInfo,
  email,
}: {
  folderInfo: MinIOFolder;
  email: string;
}) {
  const router = useRouter();
  const { prefixPath, oldFolderName } = useMemo(() => {
    const fullPath = folderInfo.name.split("/").filter(Boolean);
    const oldFolderName = fullPath.at(-1) ?? "";
    const prefixPath = fullPath.slice(0, -1).join("/");
    return { prefixPath, oldFolderName };
  }, [folderInfo]);
  const [newFolderName, setNewFolderName] = useState<string>(oldFolderName);
  const [renaming, setRenaming] = useState<boolean>(false);

  const _renameFolder = async () => {
    setRenaming(true);
    try {
      const newPath = prefixPath + "/" + newFolderName;
      await renameFileOrFolderForUser(email, folderInfo.name, newPath);
      toast.success(
        <>
          <p>Successfully renamed Folder:</p>
          <span className="inline-flex gap-1 items-center">
            <code>{oldFolderName}</code>
            <p>-</p>
            <code>{newFolderName}</code>
          </span>
        </>
      );
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message);
    } finally {
      setRenaming(false);
    }
  };
  return (
    <>
      <DialogHeader>
        <DialogTitle>Rename Folder</DialogTitle>
        <DialogDescription>Rename folder name here.</DialogDescription>
      </DialogHeader>

      <section>
        <Label htmlFor="folder-name">Enter New Folder Name</Label>
        <Input
          placeholder="Enter New Folder Name"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          id="folder-name"
        />
      </section>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button disabled={renaming} onClick={_renameFolder}>
            {renaming ? <Loader2 className="animate-spin" /> : "Rename"}
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
}

export function RenameFileDialogContent({
  fileInfo,
  email,
}: {
  fileInfo: MinIOFile;
  email: string;
}) {
  const router = useRouter();
  const { prefixPath, oldFileName, extension } = useMemo(() => {
    const fullPath = fileInfo.name.split("/").filter(Boolean);
    const oldFileName = (fullPath.at(-1) ?? ".").split(".").filter(Boolean);
    const prefixPath = fullPath.slice(0, -1).join("/");

    return {
      prefixPath,
      oldFileName: oldFileName[0],
      extension: oldFileName[1],
    };
  }, [fileInfo]);
  const [newFileName, setNewFileName] = useState<string>(oldFileName);
  const [newExtension, setNewExtension] = useState<string>(`.${extension}`);
  const [extensionEdit, setExtensionEdit] = useState<boolean>(false);
  const [renaming, setRenaming] = useState<boolean>(false);

  const _renameFile = async () => {
    setRenaming(true);
    try {
      const newPath =
        prefixPath +
        "/" +
        newFileName +
        (newExtension.startsWith(".") ? newExtension : `.${newExtension}`);
      await renameFileOrFolderForUser(email, fileInfo.name, newPath);
      toast.success(
        <>
          <p>Successfully renamed File:</p>
          <span className="inline-flex gap-1 items-center">
            <code>{oldFileName}</code>
            <p>-</p>
            <code>{newFileName}</code>
          </span>
        </>
      );
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message);
    } finally {
      setRenaming(false);
    }
  };
  return (
    <>
      <DialogHeader>
        <DialogTitle>Rename File</DialogTitle>
        <DialogDescription>Rename File name here.</DialogDescription>
      </DialogHeader>

      <section>
        <Label htmlFor="file-name">Enter New File Name</Label>
        <section className="grid grid-cols-[5fr_1fr] gap-3">
          <Input
            placeholder="Enter New File Name"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            id="file-name"
          />
          <Input
            placeholder=".ext"
            value={newExtension}
            onChange={(e) => setNewExtension(e.target.value)}
            id="extension"
            disabled={!extensionEdit}
          />
        </section>
      </section>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Advanced</AccordionTrigger>
          <AccordionContent className="flex items-center justify-between w-full">
            <Label htmlFor="extension-edit-switch">
              Enable editing extensions
            </Label>
            <Switch
              id="extension-edit-switch"
              checked={extensionEdit}
              onCheckedChange={setExtensionEdit}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button disabled={renaming} onClick={_renameFile}>
            {renaming ? <Loader2 className="animate-spin" /> : "Rename"}
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
}
