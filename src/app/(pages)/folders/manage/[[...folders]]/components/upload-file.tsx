"use client";

import { getPresignedPutURL } from "@/actions/files.actions";
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
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-uploader";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DROPZONE_MAX_FILE_SIZE } from "@/lib/consts";
import { formatFileSize } from "@/lib/utils";
import { MinIOFolder } from "@/types/files.types";
import { CloudUpload, FileUp, Loader2, Paperclip } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function UploadFile({
  email,
  currentRoute = "",
  folders,
}: {
  email: string;
  currentRoute?: string;
  folders: MinIOFolder[];
}) {
  const router = useRouter();
  const [uploading, setUploading] = useState<boolean>(false);

  const [parentFolder, setParentFolder] = useState<string>(currentRoute);
  const [files, setFiles] = useState<File[] | null>(null);

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: DROPZONE_MAX_FILE_SIZE,
    multiple: true,
  };

  const _uploadFiles = async () => {
    setUploading(true);
    try {
      if (!files || files.length === 0) throw new Error("No Files selected");
      for (const file of files) {
        const objectName = parentFolder + file.name;
        const presignedPutUrl = await getPresignedPutURL(email, objectName);
        const response = await fetch(presignedPutUrl, {
          method: "PUT",
          body: file,
        });
        if (response.ok) {
          toast.success("File Uploaded successfully: " + file.name);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message);
    } finally {
      setFiles(null);
      setParentFolder(currentRoute);
      setUploading(false);
      router.refresh();
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <FileUp />
          Upload File
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

        <FileUploader
          value={files}
          onValueChange={setFiles}
          dropzoneOptions={dropZoneConfig}
          className="relative bg-background rounded-lg outline-dashed outline-1 outline-border"
        >
          <FileInput className="flex items-center justify-center flex-col gap-2 p-4 w-full">
            <CloudUpload className="stroke-muted-foreground" />
            <p className="text-xs font-light text-muted-foreground">
              Upload files (max size upto{" "}
              {formatFileSize(DROPZONE_MAX_FILE_SIZE)})
            </p>
          </FileInput>
          <FileUploaderContent>
            {files &&
              files.length > 0 &&
              files.map((file, i) => (
                <FileUploaderItem key={i} index={i}>
                  <Paperclip className="h-4 w-4 stroke-current" />
                  <span>{file.name}</span>
                </FileUploaderItem>
              ))}
          </FileUploaderContent>
        </FileUploader>

        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={_uploadFiles} disabled={uploading}>
              {uploading ? <Loader2 className="animate-spin" /> : "Upload"}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
