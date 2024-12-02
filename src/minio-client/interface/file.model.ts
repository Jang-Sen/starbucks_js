export interface BufferedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: AppMimeType;
  size: number;
  buffer: Buffer;
}

export type AppMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

export interface HasFile {
  file: Buffer | string;
}

export interface StoredFileMetaData {
  id: string;
  name: string;
  encoding: string;
  mimetype: AppMimeType;
  size: number;
  updatedAt: Date;
  fileSrc?: string;
}

export interface StoredFile extends HasFile, StoredFileMetaData {}
