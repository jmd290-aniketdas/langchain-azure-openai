import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FOLDERS_MANAGE_ROOT_LINK } from "@/lib/consts";
import Link from "next/link";
import { Fragment } from "react";

function splitFolders(
  folders?: string[],
  offset?: number
): {
  viewFolders: string[];
  dropdownFolders: string[];
} {
  offset = offset || 3;
  if (!folders || folders.length === 0) {
    return { viewFolders: [], dropdownFolders: [] };
  }
  if (folders.length < offset) {
    return { viewFolders: folders, dropdownFolders: [] };
  }
  if (folders.length === 1) {
    return { viewFolders: [folders[0]], dropdownFolders: [] };
  }
  return {
    viewFolders: folders.slice(-offset),
    dropdownFolders: folders.slice(0, folders.length - offset),
  };
}

export default function FolderBreadcrumb({ folders }: { folders?: string[] }) {
  const rootRoute = FOLDERS_MANAGE_ROOT_LINK;
  const { viewFolders, dropdownFolders } = splitFolders(folders);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {viewFolders.length > 0 ? (
            <Link
              href={rootRoute}
              className="hover:underline underline-offset-4"
            >
              Root
            </Link>
          ) : (
            <BreadcrumbPage>Root</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {viewFolders.length > 0 && <BreadcrumbSeparator />}

        {dropdownFolders.length > 0 && (
          <>
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis className="h-4 w-4 cursor-pointer" />
                  <span className="sr-only">Toggle folders dropdown</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {dropdownFolders.map((d, i) => {
                    const route = `${rootRoute}/${dropdownFolders
                      .slice(0, i)
                      .join("/")}/${d}`;
                    return (
                      <DropdownMenuItem key={i}>
                        <Link
                          href={route}
                          className="w-full hover:underline underline-offset-4"
                        >
                          {d}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        {viewFolders.map((f, i) => {
          const indexOffset =
            (folders ? folders.length : 0) - viewFolders.length;
          const route = `${rootRoute}/${folders
            ?.slice(0, indexOffset + i + 1)
            .join("/")}`;
          return (
            <Fragment key={i}>
              <BreadcrumbItem>
                {i !== viewFolders.length - 1 ? (
                  <Link
                    href={route}
                    className="hover:underline underline-offset-4"
                  >
                    {f}
                  </Link>
                ) : (
                  <BreadcrumbPage>{f}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {i !== viewFolders.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
