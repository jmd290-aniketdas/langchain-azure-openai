type MinIOFile = {
  name: string;
  size: number;
  lastModified: Date;
};

type MinIOFolder = {
  name: string;
  lastModified: Date;
};

export { type MinIOFile, type MinIOFolder };
