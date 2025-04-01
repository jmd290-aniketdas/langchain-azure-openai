"use client";

import {
  deleteFilesOrFoldersForUser,
  listFilesAndFoldersInBucket,
} from "@/actions/files.actions";
import { fetchUserBucketName } from "@/actions/users.actions";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { formatFileSize } from "@/lib/utils";
import { MinIOFile, MinIOFolder } from "@/types/files.types";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export function DeleteFolderDialogContent({
  folderInfo,
  email,
}: {
  folderInfo: MinIOFolder;
  email: string;
}) {
  const router = useRouter();
  const [files, setFiles] = useState<MinIOFile[]>([]);
  const [folders, setFolders] = useState<MinIOFolder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<boolean>(false);

  const { path, folderName } = useMemo(() => {
    const fullPath = folderInfo.name.split("/").filter(Boolean);
    const folderName = fullPath[fullPath.length - 1];
    const path = fullPath.splice(0, -1).join("/");
    return { path, folderName };
  }, [folderInfo]);

  useEffect(() => {
    const f = async () => {
      try {
        const bucketName = await fetchUserBucketName(email);
        const { files, folders } = await listFilesAndFoldersInBucket(
          bucketName,
          folderInfo.name,
          true,
          ""
        );
        setFiles(files);
        setFolders(folders.filter((f) => f.name !== folderInfo.name));
      } catch (error) {
        console.error(error);
        toast.error((error as Error).message);
      } finally {
        setLoading(false);
      }
    };
    f();
  }, [folderInfo]);

  const _deleteFolder = () => {
    setDeleting(true);
    deleteFilesOrFoldersForUser(email, folderInfo.name)
      .then((res) =>
        toast.success(
          <span>
            Deleted <code>{res}</code> objects
          </span>
        )
      )
      .catch((err) => {
        console.error(err);
        toast.error(err.message);
      })
      .finally(() => {
        setDeleting(false);
        router.refresh();
      });
  };
  return (
    <>
      <DialogHeader>
        <DialogTitle>Delete Folder</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this Folder?
          <br />
          All the contents within the folder will also be deleted.
        </DialogDescription>
      </DialogHeader>

      <section>
        <Label>Folder Name</Label>
        <p>{folderName}</p>
      </section>

      <section>
        <Label>Folder Path</Label>
        <p>{!path ? "Root" : path}</p>
      </section>

      <section>
        <Label>Files inside</Label>
        {loading && <Loader2 className="animate-spin" />}
        {!loading && files.length === 0 && (
          <p className="text-xs font-medium text-muted-foreground">
            No Files inside.
          </p>
        )}
        {!loading && files.length !== 0 && (
          <ol className="list-decimal list-inside">
            {files.map((file, i) => (
              <li className="text-sm" key={i}>
                {file.name.substring(folderInfo.name.length)}
              </li>
            ))}
          </ol>
        )}
      </section>

      <section>
        <Label>Folders inside</Label>
        {loading && <Loader2 className="animate-spin" />}
        {!loading && folders.length === 0 && (
          <p className="text-xs font-medium text-muted-foreground">
            No Folders inside.
          </p>
        )}
        {!loading && folders.length !== 0 && (
          <ol className="list-decimal list-inside">
            {folders.map((folder, i) => (
              <li className="text-sm" key={i}>
                {folder.name}
              </li>
            ))}
          </ol>
        )}
      </section>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button variant="destructive" onClick={_deleteFolder}>
            {deleting ? <Loader2 className="animate-spin" /> : "Delete"}
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
}

export function DeleteFileDialogContent({
  fileInfo,
  email,
}: {
  fileInfo: MinIOFile;
  email: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<boolean>(false);

  const { path, fileName } = useMemo(() => {
    const fullPath = fileInfo.name.split("/").filter(Boolean);
    const fileName = fullPath[fullPath.length - 1];
    const path = fullPath.splice(0, -1).join("/");
    return { path, fileName };
  }, [fileInfo]);

  const _deleteFile = () => {
    setDeleting(true);
    deleteFilesOrFoldersForUser(email, fileInfo.name)
      .then((res) =>
        toast.success(
          <span>
            Deleted <code>{fileName}</code> successfully
          </span>
        )
      )
      .catch((err) => {
        console.error(err);
        toast.error(err.message);
      })
      .finally(() => {
        setDeleting(false);
        router.refresh();
      });
  };
  return (
    <>
      <DialogHeader>
        <DialogTitle>Delete File</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this File?
        </DialogDescription>
      </DialogHeader>

      <section>
        <Label>File Name</Label>
        <p>{fileName}</p>
      </section>

      <section>
        <Label>File Path</Label>
        <p>{!path ? "Root" : path}</p>
      </section>

      <section>
        <Label>File Size</Label>
        <p>{formatFileSize(fileInfo.size)}</p>
      </section>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button variant="destructive" onClick={_deleteFile}>
            {deleting ? <Loader2 className="animate-spin" /> : "Delete"}
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
}
