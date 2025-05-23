"use server";
import { MINIO_REGION } from "@/lib/environment-variables";
import { minio } from "@/lib/minio";
import { MinIOFile, MinIOFolder } from "@/types/files.types";
import { fetchUserBucketName } from "./users.actions";

const listFilesAndFoldersInBucket = async (
  bucketName: string,
  prefix?: string,
  recursive?: boolean,
  startAfter?: string
) => {
  "use server";
  return new Promise<{
    files: MinIOFile[];
    folders: MinIOFolder[];
    size: number;
  }>((resolve, reject) => {
    const objectsStream = minio.listObjectsV2(
      bucketName,
      prefix,
      recursive,
      startAfter
    );
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
    const ret = await listFilesAndFoldersInBucket(bucketName, "", true, "");
    return ret;
  } catch (error) {
    throw error;
  }
};

const listUserCurrentFilesAndFolders = async (
  email: string,
  currentRoute: string
) => {
  "use server";
  try {
    const { files, folders } = await listUserFilesAndFoldersInBucket(email);
    if (currentRoute !== "" && !currentRoute.endsWith("/")) {
      currentRoute += "/";
    }

    const currentFiles = files.filter((file) => {
      if (!file.name.startsWith(currentRoute)) return false;
      const remainder = file.name.substring(currentRoute.length);
      // Immediate children should not contain a slash.
      return remainder !== "" && !remainder.includes("/");
    });

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
  } catch (error) {
    throw error;
  }
};

const createBucketForUserIfNotExists = async (email: string) => {
  "use server";
  try {
    const bucketName = await fetchUserBucketName(email);
    const bucketExists = await minio.bucketExists(bucketName);
    if (!bucketExists) {
      await minio.makeBucket(bucketName, MINIO_REGION);
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
    if (!name) throw new Error("Folder Name does not exist");
    const bucketName = await fetchUserBucketName(email);
    const aggregatedFolders =
      (parentFolderName ? parentFolderName : "") + name + "/";
    const folderNames = aggregatedFolders.split("/").filter(Boolean);
    let folderName = "";
    for (const f of folderNames) {
      folderName = folderName + f + "/";
      const upl_obj = await minio.putObject(bucketName, folderName, "");
      if (!upl_obj) throw new Error("Failed to create Folder: " + folderName);
    }
  } catch (error) {
    throw error;
  }
};

const getPresignedPutURL = async (email: string, objectName: string) => {
  "use server";
  try {
    const bucketName = await fetchUserBucketName(email);
    const url = await minio.presignedPutObject(bucketName, objectName, 300);
    return url;
  } catch (error) {
    throw error;
  }
};

const getPresignedGetUrl = async (email: string, objectName: string) => {
  "use server";
  try {
    const bucketName = await fetchUserBucketName(email);
    const url = await minio.presignedGetObject(bucketName, objectName, 86400);
    return url;
  } catch (error) {
    throw error;
  }
};

const renameFileOrFolderForUser = async (
  email: string,
  oldPath: string,
  newPath: string
) => {
  "use server";
  try {
    const bucketName = await fetchUserBucketName(email);

    if (!oldPath.includes(".") && !oldPath.endsWith("/")) oldPath += "/";
    if (!newPath.includes(".") && !newPath.endsWith("/")) newPath += "/";

    const { files, folders } = await listFilesAndFoldersInBucket(
      bucketName,
      oldPath,
      true,
      ""
    );
    const objects = [
      ...folders.map((f) => f.name),
      ...files.map((f) => f.name),
    ];

    for (const oldObjectName of objects) {
      const remainder = oldObjectName.substring(oldPath.length);
      const newObjectName = newPath + remainder;

      const source = `/${bucketName}/${oldObjectName}`;
      await minio.copyObject(bucketName, newObjectName, source);
    }
    await minio.removeObjects(bucketName, objects);

    return objects.length;
  } catch (error) {
    throw error;
  }
};

const deleteFilesOrFoldersForUser = async (
  email: string,
  objectName: string
) => {
  try {
    const bucketName = await fetchUserBucketName(email);
    const { files, folders } = await listFilesAndFoldersInBucket(
      bucketName,
      objectName,
      true,
      ""
    );
    const objects = [
      objectName,
      ...files.map((f) => f.name),
      ...folders.map((f) => f.name),
    ];
    await minio.removeObjects(bucketName, objects);

    return objects.length;
  } catch (error) {
    throw error;
  }
};

const pasteFilesOrFoldersForUser = async (
  email: string,
  pathFrom: string,
  pathTo: string
) => {
  try {
    const bucketName = await fetchUserBucketName(email);

    // if pathTo is a file location, paste to the file's directory
    if (pathTo.includes("."))
      pathTo = pathTo.split("/").filter(Boolean).slice(0, -1).join("/") + "/";

    if (pathFrom.includes(".")) {
      // copy the file to the destination
      const fullPath = pathFrom.split("/").filter(Boolean);
      let pathWithoutFileName = fullPath.slice(0, -1).join("/");
      if (pathWithoutFileName) pathWithoutFileName += "/";
      const fileName = fullPath.at(-1) ?? "";
      const aggregatedPaths = pathTo + pathWithoutFileName;
      await createFolderforUser(email, aggregatedPaths);

      const newObjectName = aggregatedPaths + fileName;
      const source = `/${bucketName}/${pathFrom}`;
      await minio.copyObject(bucketName, newObjectName, source);
    } else {
      // copy the folder and its contents to the destination
      const objectsUnderPath = await listFilesAndFoldersInBucket(
        bucketName,
        pathFrom,
        true,
        ""
      );
      const objectsToCopy = [
        ...objectsUnderPath.files.map((f) => f.name.substring(pathFrom.length)),
        ...objectsUnderPath.folders.map((f) =>
          f.name.substring(pathFrom.length)
        ),
      ];
      const copyFolder = pathFrom.split("/").filter(Boolean).at(-1) ?? "";
      objectsToCopy.forEach(async (object) => {
        const source = `${bucketName}/${pathFrom}${object}`;
        const destination = `${pathTo}${copyFolder}/${object}`;
        await minio.copyObject(bucketName, destination, source);
      });
    }
  } catch (error) {
    throw error;
  }
};

export {
  createBucketForUserIfNotExists,
  createFolderforUser,
  deleteFilesOrFoldersForUser,
  getPresignedGetUrl,
  getPresignedPutURL,
  listFilesAndFoldersInBucket,
  listUserCurrentFilesAndFolders,
  listUserFilesAndFoldersInBucket,
  pasteFilesOrFoldersForUser,
  renameFileOrFolderForUser,
};
