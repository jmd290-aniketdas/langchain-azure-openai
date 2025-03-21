import * as Minio from "minio";
import {
  MINIO_ACCESS_KEY,
  MINIO_ENDPOINT,
  MINIO_PORT,
  MINIO_REGION,
  MINIO_SECRET_KEY,
  NODE_ENV,
} from "./environment-variables";

declare global {
  var minio: Minio.Client | undefined;
}

const minio =
  global.minio ||
  new Minio.Client({
    endPoint: MINIO_ENDPOINT,
    port: MINIO_PORT,
    useSSL: NODE_ENV !== "development",
    accessKey: MINIO_ACCESS_KEY,
    secretKey: MINIO_SECRET_KEY,
    region: MINIO_REGION,
  });

if (NODE_ENV === "development") global.minio = minio;

export { minio };
