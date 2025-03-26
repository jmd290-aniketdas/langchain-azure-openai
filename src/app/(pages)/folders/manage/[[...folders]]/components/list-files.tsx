import { getPresignedGetUrl } from "@/actions/files.actions";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatFileSize } from "@/lib/utils";
import { MinIOFile } from "@/types/files.types";
import { File, Folder, Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

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
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          className="grid grid-cols-subgrid col-span-full p-0"
        >
          <a
            href={presignedUrl}
            className="grid grid-cols-subgrid col-span-full items-center px-3 py-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            <File />
            <p className="text-start">{fileName}</p>
            <p className="text-start">{formatFileSize(fileInfo.size)}</p>
            <p className="text-end">{fileInfo.lastModified.toDateString()}</p>
          </a>
        </Button>
      </TooltipTrigger>
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
    </Tooltip>
  );
}
