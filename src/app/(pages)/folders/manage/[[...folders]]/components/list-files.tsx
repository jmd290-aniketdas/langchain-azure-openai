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
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatFileSize } from "@/lib/utils";
import { MinIOFile } from "@/types/files.types";
import { File, FolderPen, PanelTop, Settings2, Trash2 } from "lucide-react";
import { Suspense } from "react";
import {
  CopyContextMenuItem,
  PasteContextMenuItem,
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
      <div className="grid gap-x-4 gap-y-2 grid-cols-[2rem_3fr_1fr_1fr] w-full">
        <section className="grid grid-cols-subgrid col-span-full text-xs text-muted-foreground border-b">
          <p className="col-start-2 text-start">Name</p>
          <p className="col-start-3 text-start">Size</p>
          <p className="col-start-4 text-end pr-2">Last Modified</p>
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
    <ContextMenu>
      <Tooltip>
        <ContextMenuTrigger asChild>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="grid grid-cols-subgrid col-span-full p-0"
            >
              <a
                href={presignedUrl}
                className="grid grid-cols-subgrid col-span-full items-center px-3 py-2"
                target="_blank"
              >
                <File />
                <p className="text-start">{fileName}</p>
                <p className="text-start">{formatFileSize(fileInfo.size)}</p>
                <p className="text-end">
                  {fileInfo.lastModified.toDateString()}
                </p>
              </a>
            </Button>
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
          <RenameFileDialogContent fileInfo={fileInfo} email={email} />
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
          <DeleteFileDialogContent fileInfo={fileInfo} email={email} />
        </ContextMenuDialog>
      </ContextMenuGroup>
    </ContextMenuContent>
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
