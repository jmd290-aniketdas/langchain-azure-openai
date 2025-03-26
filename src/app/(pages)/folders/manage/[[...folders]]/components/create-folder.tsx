"use client";

import { createFolderforUser } from "@/actions/files.actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MinIOFolder } from "@/types/files.types";
import { FolderUp, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateFolder({
  email,
  currentRoute = "",
  folders,
}: {
  email: string;
  currentRoute?: string;
  folders: MinIOFolder[];
}) {
  const router = useRouter();
  const [parentFolder, setParentFolder] = useState<string>(currentRoute);
  const [folderName, setFolderName] = useState<string>("");
  const [creating, setCreating] = useState<boolean>(false);

  const _createFolder = async () => {
    setCreating(true);
    try {
      if (!folderName) throw new Error("No Folder Name provided");
      if (folderName.includes(".")) throw new Error("Invalid Folder name");
      await createFolderforUser(email, folderName, parentFolder);
      toast.success("Created Folder: " + folderName);
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message);
    } finally {
      setCreating(false);
      setFolderName("");
      setParentFolder(currentRoute);
      router.refresh();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FolderUp />
          Create Folder
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Folder</DialogTitle>
          <DialogDescription>Enter Folder Name</DialogDescription>
        </DialogHeader>
        <section className="space-y-1">
          <Label htmlFor="parent-select">Parent Folder</Label>
          <Select
            onValueChange={(value) => {
              if (value === "root") value = "";
              setParentFolder(value);
            }}
            value={parentFolder}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder="Select Parent Folder (default Root)"
                className="w-full truncate"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="root">Root</SelectItem>
              {folders.map((f, i) => (
                <SelectItem value={f.name} key={i}>
                  {f.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>

        <section className="space-y-1">
          <Label htmlFor="folder-name">Enter Folder Name</Label>
          <Input
            placeholder="Enter Folder Name"
            name="folder-name"
            id="folder-name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
          />
        </section>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={_createFolder} disabled={creating}>
              {creating ? <Loader2 className="animate-spin" /> : "Create"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
