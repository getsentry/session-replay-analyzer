import { Storage } from '@google-cloud/storage'
import { MockStorage, type IStorage } from 'mock-gcs'
import {BUCKET_NAME, ENVIRONMENT} from './config'
import zlib from 'zlib';

function newStorage(): IStorage {
  if (ENVIRONMENT == "test") {
    return new MockStorage()
  } else {
    return new Storage()
  }
}

async function downloadFromFilenames (storage: IStorage, filenames: string[]): Promise<string[]> {
  // Only fetch the first two segments.
  filenames = filenames.slice(0, 2);
  return await Promise.all(filenames.map(async (f) => await downloadFromFilename(storage, f)))
}

async function downloadFromFilename (storage: IStorage, filename: string): Promise<string> {
  try {
    const response = await storage.bucket(BUCKET_NAME).file(filename).download()
    return zlib.unzipSync(response[0]).toString()
  } catch (e) {
    return '[]'
  }
}

export { downloadFromFilename, downloadFromFilenames, newStorage }
