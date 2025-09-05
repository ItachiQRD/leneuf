// types/formidable.ts
import { File } from 'formidable';

export interface FormidableFile {
  filepath: string;
  originalFilename: string | null;
  newFilename: string;
  mimetype: string | null;
  size: number;
  lastModifiedDate?: Date | null;
  hashAlgorithm?: boolean | string | null;
  hash?: string | null;
  toJSON: () => Record<string, any>;
}

// Pour rendre le type compatible avec le type File de formidable
export type FormidableFileWithPath = FormidableFile & File;
