import { Storage } from '@google-cloud/storage'
import { MockStorage, type IStorage } from 'mock-gcs'
import {BUCKET_NAME, ENVIRONMENT, REPLAY_MAX_SEGMENT} from './config'
import zlib from 'zlib';
import * as Sentry from "@sentry/node";

function newStorage(): IStorage {
  if (ENVIRONMENT == "test") {
    return new MockStorage()
  } else {
    return new Storage()
  }
}

async function downloadFromFilenames (storage: IStorage, filenames: string[]): Promise<string[]> {
  filenames = filenames.slice(0, REPLAY_MAX_SEGMENT);
  return await Promise.all(filenames.map(async (f) => await downloadFromFilename(storage, f)))
}

async function downloadFromFilename (storage: IStorage, filename: string): Promise<string> {
  try {
    const response = await storage.bucket(BUCKET_NAME).file(filename).download()
    return zlib.unzipSync(response[0]).toString()
  } catch (e) {
    Sentry.captureException(e, (scope) => {
      scope.setTag("fileName", filename);
      scope.setTag("bucketName", BUCKET_NAME);
      return scope;
    });
    return '[]'
  }
}

export { downloadFromFilename, downloadFromFilenames, newStorage }
