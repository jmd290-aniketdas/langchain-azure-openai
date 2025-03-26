import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FOLDERS_MANAGE_ROOT_LINK } from "@/lib/consts";
import { MinIOFolder } from "@/types/files.types";
import { Folder } from "lucide-react";
import Link from "next/link";

export default async function ListFolders({
  folders,
}: {
  folders: MinIOFolder[];
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
          <FolderDisplay folderInfo={f} key={i} />
        ))}
      </div>
    </div>
  );
}

function FolderDisplay({ folderInfo }: { folderInfo: MinIOFolder }) {
  const folders = folderInfo.name.split("/").filter(Boolean);
  const folderName = folders[folders.length - 1];
  const route = FOLDERS_MANAGE_ROOT_LINK + "/" + folderInfo.name;
  return (
    <Tooltip>
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
            <p className="text-end">{folderInfo.lastModified.toDateString()}</p>
          </Link>
        </Button>
      </TooltipTrigger>
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
    </Tooltip>
  );
}
