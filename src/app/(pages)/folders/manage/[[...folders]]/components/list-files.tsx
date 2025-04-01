import { getPresignedGetUrl } from "@/actions/files.actions";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuDialog,
  DropdownMenuDialogContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuItemDialogTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatFileSize } from "@/lib/utils";
import { MinIOFile } from "@/types/files.types";
import {
  EllipsisVertical,
  File,
  FolderPen,
  Loader2,
  PanelTop,
  Settings2,
  Trash2,
} from "lucide-react";
import { Suspense } from "react";
import {
  CopyContextMenuItem,
  CopyDropdownMenuItem,
  PasteContextMenuItem,
  PasteDropdownMenuItem,
} from "./copy-paste-context-menu-item";
import { DeleteFileDialogContent } from "./delete-dialog-content";
import { RenameFileDialogContent } from "./rename-dialog-content";

export default function ListFiles({
  files,
  email,
}: {
  files: MinIOFile[];
  email: string;
}) {
  return (
    <div className="space-y-3">
      <section className="w-full">
        <p className="text-xl font-light text-muted-foreground">Files</p>
        <hr />
      </section>
      <div className="grid gap-x-4 grid-cols-[2rem_3fr_1fr_1fr_3rem] w-full">
        <section className="grid grid-cols-subgrid col-span-full text-xs text-muted-foreground border-b px-3">
          <p className="col-start-2 text-start">Name</p>
          <p className="col-start-3 text-start">Size</p>
          <p className="col-start-4 text-end">Last Modified</p>
        </section>
        {files.length <= 0 && (
          <span className="text-sm font-light text-muted-foreground text-center w-full col-span-full">
            No Files found.
          </span>
        )}
        {files.map((f, i) => (
          <Suspense
            key={i}
            fallback={<Skeleton className="h-9 col-span-full" />}
          >
            <FilesDisplay fileInfo={f} email={email} />
          </Suspense>
        ))}
      </div>
    </div>
  );
}

async function FilesDisplay({
  fileInfo,
  email,
}: {
  fileInfo: MinIOFile;
  email: string;
}) {
  const filePaths = fileInfo.name.split("/").filter(Boolean);
  const fileName = filePaths[filePaths.length - 1];
  const presignedUrl = await getPresignedGetUrl(email, fileInfo.name);
  return (
    <section className="grid grid-cols-subgrid col-span-full items-center text-sm font-medium transition-colors border-b rounded hover:bg-accent/60 hover:text-accent-foreground px-3">
      <ContextMenu>
        <Tooltip>
          <ContextMenuTrigger asChild>
            <TooltipTrigger asChild>
              <a
                href={presignedUrl}
                className="grid grid-cols-subgrid col-span-4 items-center h-9"
                target="_blank"
              >
                <File className="size-4" />
                <p className="text-start">{fileName}</p>
                <p className="text-start">{formatFileSize(fileInfo.size)}</p>
                <p className="text-end">
                  {fileInfo.lastModified.toDateString()}
                </p>
              </a>
            </TooltipTrigger>
          </ContextMenuTrigger>
          <FileTooltipContent fileInfo={fileInfo} />
        </Tooltip>
        <FileContextMenuContent
          fileInfo={fileInfo}
          email={email}
          route={presignedUrl}
        />
      </ContextMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-7 justify-self-center">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <FolderDropdownMenuContent
          fileInfo={fileInfo}
          route={presignedUrl}
          email={email}
        />
      </DropdownMenu>
    </section>
  );
}

function FileTooltipContent({ fileInfo }: { fileInfo: MinIOFile }) {
  return (
    <TooltipContent>
      <p>
        <span className="font-light">Path:&nbsp;</span>
        <span className="font-medium">{fileInfo.name}</span>
      </p>
      <p>
        <span className="font-light">Size:&nbsp;</span>
        <span className="font-medium">{formatFileSize(fileInfo.size)}</span>
      </p>
      <p>
        <span className="font-light">Last Modified:</span>&nbsp;
        <span className="font-medium">
          {fileInfo.lastModified.toDateString()}
        </span>
      </p>
    </TooltipContent>
  );
}

function FileContextMenuContent({
  fileInfo,
  route,
  email,
}: {
  fileInfo: MinIOFile;
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
            Open
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
          <ContextMenuDialogContent>
            <RenameFileDialogContent fileInfo={fileInfo} email={email} />
          </ContextMenuDialogContent>
        </ContextMenuDialog>

        <CopyContextMenuItem info={fileInfo} />

        <PasteContextMenuItem info={fileInfo} email={email} />
      </ContextMenuGroup>

      <ContextMenuSeparator />

      <ContextMenuGroup>
        <ContextMenuDialog>
          <ContextMenuItemDialogTrigger>
            <Settings2 />
            Properties
          </ContextMenuItemDialogTrigger>
          <PropertiesDialogContent fileInfo={fileInfo} />
        </ContextMenuDialog>
      </ContextMenuGroup>

      <ContextMenuSeparator />

      <ContextMenuGroup>
        <ContextMenuDialog>
          <ContextMenuItemDialogTrigger variant="destructive">
            <Trash2 />
            Delete
          </ContextMenuItemDialogTrigger>
          <ContextMenuDialogContent>
            <DeleteFileDialogContent fileInfo={fileInfo} email={email} />
          </ContextMenuDialogContent>
        </ContextMenuDialog>
      </ContextMenuGroup>
    </ContextMenuContent>
  );
}

function FolderDropdownMenuContent({
  fileInfo,
  route,
  email,
}: {
  fileInfo: MinIOFile;
  route: string;
  email: string;
}) {
  return (
    <DropdownMenuContent className="w-64">
      <DropdownMenuLabel>Options</DropdownMenuLabel>

      <DropdownMenuGroup>
        <a href={route} target="_blank">
          <DropdownMenuItem>
            <PanelTop />
            Open in a new tab
          </DropdownMenuItem>
        </a>
      </DropdownMenuGroup>

      <DropdownMenuSeparator />

      <DropdownMenuGroup>
        <DropdownMenuDialog>
          <DropdownMenuItemDialogTrigger>
            <FolderPen />
            Rename
          </DropdownMenuItemDialogTrigger>
          <DropdownMenuDialogContent>
            <RenameFileDialogContent fileInfo={fileInfo} email={email} />
          </DropdownMenuDialogContent>
        </DropdownMenuDialog>

        <CopyDropdownMenuItem info={fileInfo} />

        <PasteDropdownMenuItem info={fileInfo} email={email} />
      </DropdownMenuGroup>

      <DropdownMenuSeparator />

      <DropdownMenuGroup>
        <DropdownMenuDialog>
          <DropdownMenuItemDialogTrigger>
            <Settings2 />
            Properties
          </DropdownMenuItemDialogTrigger>

          <DropdownMenuDialogContent>
            <DialogHeader>
              <DialogTitle>Properties</DialogTitle>
              <DialogDescription>File Details listed</DialogDescription>
            </DialogHeader>
            <Suspense fallback={<Loader2 className="animate-spin" />}>
              <PropertiesDialogContent fileInfo={fileInfo} />
            </Suspense>
          </DropdownMenuDialogContent>
        </DropdownMenuDialog>
      </DropdownMenuGroup>

      <DropdownMenuSeparator />

      <DropdownMenuGroup>
        <DropdownMenuDialog>
          <DropdownMenuItemDialogTrigger variant="destructive">
            <Trash2 />
            Delete
          </DropdownMenuItemDialogTrigger>
          <DropdownMenuDialogContent>
            <DeleteFileDialogContent fileInfo={fileInfo} email={email} />
          </DropdownMenuDialogContent>
        </DropdownMenuDialog>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  );
}

function PropertiesDialogContent({ fileInfo }: { fileInfo: MinIOFile }) {
  const fullPath = fileInfo.name.split("/").filter(Boolean);
  const fileName = fullPath[fullPath.length - 1];
  const path = fullPath.splice(0, -1).join("/");
  return (
    <ContextMenuDialogContent>
      <DialogHeader>
        <DialogTitle>Properties</DialogTitle>
        <DialogDescription>File Details listed</DialogDescription>
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
    </ContextMenuDialogContent>
  );
}
