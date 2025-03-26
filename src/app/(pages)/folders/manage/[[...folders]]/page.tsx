import { auth } from "@/auth";
import { DEFAULT_LOGIN_ROUTE } from "@/lib/environment-variables";
import { redirect } from "next/navigation";
import CreateFolder from "./components/create-folder";
import FolderBreadcrumb from "./components/folder-breadcrumb";
import UploadFile from "./components/upload-file";
import {
  listUserCurrentFilesAndFolders,
  listUserFilesAndFoldersInBucket,
} from "@/actions/files.actions";
import ListFolders from "./components/list-folders";
import ListFiles from "./components/list-files";

export default async function Folders({
  params,
}: {
  params: Promise<{ folders?: string[] }>;
}) {
  const session = await auth();
  if (!session) redirect(DEFAULT_LOGIN_ROUTE);
  const { folders } = await params;
  const currentRoute =
    !folders || folders.length === 0 ? "" : `${folders.join("/")}/`;

  const { currentFiles, currentFolders } = await listUserCurrentFilesAndFolders(
    session.user.email,
    currentRoute
  );
  const { folders: allFolders } = await listUserFilesAndFoldersInBucket(
    session.user.email
  );

  return (
    <div className="space-y-8">
      <section className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <FolderBreadcrumb folders={folders} />
        <span className="flex gap-3 items-center">
          <CreateFolder
            email={session.user.email}
            currentRoute={currentRoute}
            folders={allFolders}
          />
          <UploadFile
            email={session.user.email}
            currentRoute={currentRoute}
            folders={allFolders}
          />
        </span>
      </section>
      <ListFolders folders={currentFolders} />
      <ListFiles files={currentFiles} email={session.user.email} />
    </div>
  );
}
