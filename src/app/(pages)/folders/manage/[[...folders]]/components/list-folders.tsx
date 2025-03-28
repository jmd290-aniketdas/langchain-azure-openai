import { listFilesAndFoldersInBucket } from "@/actions/files.actions";
import { fetchUserBucketName } from "@/actions/users.actions";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuDialog,
  ContextMenuDialogContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuItemDialogTrigger,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FOLDERS_MANAGE_ROOT_LINK } from "@/lib/consts";
import { formatFileSize } from "@/lib/utils";
import { MinIOFolder } from "@/types/files.types";
import {
  Folder,
  FolderPen,
  Loader2,
  PanelTop,
  Settings2,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import {
  CopyContextMenuItem,
  PasteContextMenuItem,
} from "./copy-paste-context-menu-item";
import { DeleteFolderDialogContent } from "./delete-dialog-content";
import { RenameFolderDialogContent } from "./rename-dialog-content";

export default async function ListFolders({
  folders,
  email,
}: {
  folders: MinIOFolder[];
  email: string;
}) {
  return (
    <div className="space-y-3">
      <section className="w-full">
        <p className="text-xl font-light text-muted-foreground">Folders</p>
        <hr />
      </section>
      <div className="grid gap-x-4 gap-y-2 grid-cols-[2rem_3fr_1fr] w-full">
        <section className="grid grid-cols-subgrid col-span-full text-xs text-muted-foreground border-b">
          <p className="col-start-2 text-start">Name</p>
          <p className="col-start-3 text-end pr-2">Last Modified</p>
        </section>
        {folders.length <= 0 && (
          <span className="text-sm font-light text-muted-foreground text-center w-full col-span-full">
            No Folders found.
          </span>
        )}
        {folders.map((f, i) => (
          <FolderDisplay folderInfo={f} email={email} key={i} />
        ))}
      </div>
    </div>
  );
}

function FolderDisplay({
  folderInfo,
  email,
}: {
  folderInfo: MinIOFolder;
  email: string;
}) {
  const folders = folderInfo.name.split("/").filter(Boolean);
  const folderName = folders[folders.length - 1];
  const route = FOLDERS_MANAGE_ROOT_LINK + "/" + folderInfo.name;
  return (
    <ContextMenu>
      <Tooltip>
        <ContextMenuTrigger asChild>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="grid grid-cols-subgrid col-span-full p-0"
            >
              <Link
                href={route}
                className="grid grid-cols-subgrid col-span-full items-center px-3 py-2"
              >
                <Folder />
                <p className="text-start">{folderName}</p>
                <p className="text-end">
                  {folderInfo.lastModified.toDateString()}
                </p>
              </Link>
            </Button>
          </TooltipTrigger>
        </ContextMenuTrigger>
        <FolderTooltipContent folderInfo={folderInfo} />
      </Tooltip>
      <FolderContextMenuContent
        folderInfo={folderInfo}
        route={route}
        email={email}
      />
    </ContextMenu>
  );
}

function FolderTooltipContent({ folderInfo }: { folderInfo: MinIOFolder }) {
  return (
    <TooltipContent>
      <p>
        <span className="font-light">Path:&nbsp;</span>
        <span className="font-medium">{folderInfo.name.slice(0, -1)}</span>
      </p>
      <p>
        <span className="font-light">Last Modified:</span>&nbsp;
        <span className="font-medium">
          {folderInfo.lastModified.toDateString()}
        </span>
      </p>
    </TooltipContent>
  );
}

function FolderContextMenuContent({
  folderInfo,
  route,
  email,
}: {
  folderInfo: MinIOFolder;
  route: string;
  email: string;
}) {
  return (
    <ContextMenuContent className="w-64">
      <ContextMenuLabel>Options</ContextMenuLabel>

      <ContextMenuGroup>
        <a href={route} target="_blank">
          <ContextMenuItem>
            <PanelTop />
            Open in a new tab
          </ContextMenuItem>
        </a>
      </ContextMenuGroup>

      <ContextMenuSeparator />

      <ContextMenuGroup>
        <ContextMenuDialog>
          <ContextMenuItemDialogTrigger>
            <FolderPen />
            Rename
          </ContextMenuItemDialogTrigger>
          <RenameFolderDialogContent folderInfo={folderInfo} email={email} />
        </ContextMenuDialog>

        <CopyContextMenuItem info={folderInfo} />

        <PasteContextMenuItem info={folderInfo} email={email} />
      </ContextMenuGroup>

      <ContextMenuSeparator />

      <ContextMenuGroup>
        <ContextMenuDialog>
          <ContextMenuItemDialogTrigger>
            <Settings2 />
            Properties
          </ContextMenuItemDialogTrigger>

          <ContextMenuDialogContent>
            <DialogHeader>
              <DialogTitle>Properties</DialogTitle>
              <DialogDescription>File Details listed</DialogDescription>
            </DialogHeader>
            <Suspense fallback={<Loader2 className="animate-spin" />}>
              <PropertiesDialogContent folderInfo={folderInfo} email={email} />
            </Suspense>
          </ContextMenuDialogContent>
        </ContextMenuDialog>
      </ContextMenuGroup>

      <ContextMenuSeparator />

      <ContextMenuGroup>
        <ContextMenuDialog>
          <ContextMenuItemDialogTrigger variant="destructive">
            <Trash2 />
            Delete
          </ContextMenuItemDialogTrigger>
          <DeleteFolderDialogContent folderInfo={folderInfo} email={email} />
        </ContextMenuDialog>
      </ContextMenuGroup>
    </ContextMenuContent>
  );
}

async function PropertiesDialogContent({
  folderInfo,
  email,
}: {
  folderInfo: MinIOFolder;
  email: string;
}) {
  const fullPath = folderInfo.name.split("/").filter(Boolean);
  const folderName = fullPath[fullPath.length - 1];
  const path = fullPath.splice(0, -1).join("/");

  const bucketName = await fetchUserBucketName(email);

  const { files, folders, size } = await listFilesAndFoldersInBucket(
    bucketName,
    folderInfo.name,
    true,
    ""
  );
  return (
    <>
      <section>
        <Label>Folder Name</Label>
        <p>{folderName}</p>
      </section>

      <section>
        <Label>Folder Path</Label>
        <p>{!path ? "Root" : path}</p>
      </section>

      <section>
        <Label>Folder Size</Label>
        <p>{formatFileSize(size)}</p>
      </section>

      <section>
        <Label>Files inside</Label>
        {files.length === 0 && (
          <p className="text-xs font-medium text-muted-foreground">
            No Files inside.
          </p>
        )}
        {files.length !== 0 && (
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
        {folders.length === 0 && (
          <p className="text-xs font-medium text-muted-foreground">
            No Folders inside.
          </p>
        )}
        {folders.length !== 0 && (
          <ol className="list-decimal list-inside">
            {folders.map((folder, i) => (
              <li className="text-sm" key={i}>
                {folder.name}
              </li>
            ))}
          </ol>
        )}
      </section>
    </>
  );
}
