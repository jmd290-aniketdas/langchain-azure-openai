import { listUserFilesAndFoldersInBucket } from "@/actions/files.actions";
import { MinIOFile, MinIOFolder } from "@/types/files.types";
import { useSession } from "next-auth/react";
import { createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type FilesContext = {
  files: MinIOFile[];
  folders: MinIOFolder[];
  loading: boolean;

  selectedFile: string;
  setSelectedFile: Dispatch<SetStateAction<string>>;

  selectedFolder: string;
  setSelectedFolder: Dispatch<SetStateAction<string>>;

  reloadFilesAndFolders: () => void;
};

const FilesContext = createContext<FilesContext | undefined>(undefined);

const FilesProvider = ({ children }: { children?: React.ReactNode }) => {
  const [files, setFiles] = useState<MinIOFile[]>([]);
  const [folders, setFolders] = useState<MinIOFolder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedFile, setSelectedFile] = useState<string>("");
  const [selectedFolder, setSelectedFolder] = useState<string>("");

  const { data: session, status: sessionStatus } = useSession();

  const loadFilesAndFolders = (email: string) => {
    listUserFilesAndFoldersInBucket(email)
      .then((res) => {
        setFiles(res.files);
        setFolders(res.folders);
      })
      .catch((e) => {
        console.error(e);
        toast.error(e.message);
      })
      .finally(() => setLoading(false));
  };

  const reloadFilesAndFolders = useCallback(() => {
    if (sessionStatus !== "authenticated") return;
    loadFilesAndFolders(session.user.email);
  }, [sessionStatus, session]);

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      loadFilesAndFolders(session.user.email);
    }
  }, [session, sessionStatus]);

  const contextValue = useMemo(
    () => ({
      files,
      folders,
      loading,
      selectedFile,
      setSelectedFile,
      selectedFolder,
      setSelectedFolder,
      reloadFilesAndFolders,
    }),
    [files, folders, loading, selectedFile, setSelectedFile, selectedFolder, setSelectedFolder, reloadFilesAndFolders]
  );

  return <FilesContext.Provider value={contextValue}>{children}</FilesContext.Provider>;
};

const useFilesContext = () => {
  const _context = useContext(FilesContext);
  if (!_context) throw new Error("useFilesContext must be used within a FilesContext");
  return _context;
};

export { FilesProvider, useFilesContext, type FilesContext };
