"use server";
import { MINIO_REGION } from "@/lib/environment-variables";
import { minio } from "@/lib/minio";
import { prisma } from "@/lib/prisma";
import { MinIOFile, MinIOFolder } from "@/types/files.types";
import { fetchUserBucketName } from "./users.actions";
import { wait } from "@/lib/utils";

const listFilesAndFoldersInBucket = async (bucketName: string) => {
  "use server";
  return new Promise<{
    files: MinIOFile[];
    folders: MinIOFolder[];
    size: number;
  }>((resolve, reject) => {
    const objectsStream = minio.listObjectsV2(bucketName, "", true, "");
    const files: MinIOFile[] = [];
    const folders: MinIOFolder[] = [];
    let size: number = 0;

    objectsStream.on("data", function (chunk) {
      if (chunk.name) {
        const parts = chunk.name.split("/");
        const lastPart = parts[parts.length - 1];
        const hasExtension = lastPart.includes(".");
        if (hasExtension)
          files.push({
            name: chunk.name,
            size: chunk.size,
            lastModified: chunk.lastModified,
          });
        else
          folders.push({ name: chunk.name, lastModified: chunk.lastModified });
      }
      size += chunk.size;
    });

    objectsStream.on("error", function (err) {
      reject(err);
    });

    objectsStream.on("end", function () {
      resolve({ files, folders, size });
    });
  });
};

const listUserFilesAndFoldersInBucket = async (email: string) => {
  "use server";
  try {
    const bucketName = await fetchUserBucketName(email);
    const ret = await listFilesAndFoldersInBucket(bucketName);
    return ret;
  } catch (error) {
    throw error;
  }
};

const listUserCurrentFilesAndFolders = async (
  email: string,
  currentRoute: string
) => {
  const { files, folders } = await listUserFilesAndFoldersInBucket(email);
  // Ensure that if the currentRoute is not empty, it ends with a slash.
  if (currentRoute !== "" && !currentRoute.endsWith("/")) {
    currentRoute += "/";
  }

  // Files: Only include those that start with currentRoute and don't have extra nested folders.
  const currentFiles = files.filter((file) => {
    if (!file.name.startsWith(currentRoute)) return false;
    const remainder = file.name.substring(currentRoute.length);
    // Immediate children should not contain a slash.
    return remainder !== "" && !remainder.includes("/");
  });

  // Folders: Only include those that start with currentRoute and are immediate children.
  const currentFolders = folders.filter((folder) => {
    if (!folder.name.startsWith(currentRoute)) return false;
    const remainder = folder.name.substring(currentRoute.length);
    if (remainder === "") return false;
    // Remove any trailing slash for checking.
    const trimmed = remainder.endsWith("/")
      ? remainder.slice(0, -1)
      : remainder;
    // Immediate folders won't contain another slash.
    return !trimmed.includes("/");
  });

  return { currentFiles, currentFolders };
};

const createBucketForUserIfNotExists = async (email: string) => {
  "use server";
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User does not exist");

    const bucketExists = await minio.bucketExists(user.bucketName);
    if (!bucketExists) {
      await minio.makeBucket(user.bucketName, MINIO_REGION);
    }
  } catch (error) {
    throw error;
  }
};

const createFolderforUser = async (
  email: string,
  name: string,
  parentFolderName?: string
) => {
  "use server";
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) throw new Error("User does not exist");
    if (!name) throw new Error("Folder Name does not exist");

    const aggregatedFolders =
      (parentFolderName ? parentFolderName : "") + name + "/";
    const folderNames = aggregatedFolders.split("/").filter(Boolean);
    let folderName = "";
    for (const f of folderNames) {
      folderName = folderName + f + "/";
      const upl_obj = await minio.putObject(user.bucketName, folderName, "");
      if (!upl_obj) throw new Error("Failed to create Folder: " + folderName);
    }
  } catch (error) {
    throw error;
  }
};

const getPresignedPutURL = async (email: string, objectName: string) => {
  "use server";
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) throw new Error("User does not exist");

  const url = await minio.presignedPutObject(user.bucketName, objectName, 300);
  return url;
};

const getPresignedGetUrl = async (email: string, objectName: string) => {
  "use server";
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) throw new Error("User does not exist");

  const url = await minio.presignedGetObject(
    user.bucketName,
    objectName,
    86400
  );
  return url;
};

export {
  createBucketForUserIfNotExists,
  createFolderforUser,
  getPresignedGetUrl,
  getPresignedPutURL,
  listFilesAndFoldersInBucket,
  listUserCurrentFilesAndFolders,
  listUserFilesAndFoldersInBucket,
};
