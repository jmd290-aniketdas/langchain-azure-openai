"use server";
import { MINIO_REGION } from "@/lib/environment-variables";
import { minio } from "@/lib/minio";
import { fetchUserBucketName } from "./users.actions";
import { Session } from "next-auth";
import { prisma } from "@/lib/prisma";

const listFilesInBucket = (bucketName: string) =>
  new Promise<{ data: string[]; size: number }>((resolve, reject) => {
    const objectsStream = minio.listObjectsV2(bucketName, "", true, "");
    const data: string[] = [];
    let size: number = 0;

    objectsStream.on("data", function (chunk) {
      if (chunk.name) data.push(chunk.name);
      size += chunk.size;
    });

    objectsStream.on("error", function (err) {
      reject(err);
    });

    objectsStream.on("end", function () {
      resolve({ data, size });
    });
  });

const listUserFilesInBucket = async (email: string) => {
  "use server";
  const bucketName = await fetchUserBucketName(email);
  const ret = await listFilesInBucket(bucketName);
  return ret;
};

const createBucketForUserIfNotExists = async (email: string) => {
  "use server";
  const user = await prisma.user.findUnique({
    where: { email },
    include: { bucket: true },
  });
  if (!user) throw new Error("User does not exist");

  let bucket = user.bucket;
  if (!bucket) {
    bucket = await prisma.bucket.create({ data: { userId: user.id } });
    if (!bucket) throw new Error("Failed to create Bucket for User");
  }

  const bucketExists = await minio.bucketExists(bucket.id);
  if (!bucketExists) {
    await minio.makeBucket(bucket.id, MINIO_REGION);
  }
};

export {
  listFilesInBucket,
  listUserFilesInBucket,
  createBucketForUserIfNotExists,
};
