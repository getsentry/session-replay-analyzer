import { Storage } from '@google-cloud/storage'
import { MockStorage, type IStorage } from 'mock-gcs'

const bucket = 'bucket_name'

function newStorage(): IStorage {
  if (process.env.NODE_ENV == "test") {
    return new MockStorage()
  } else {
    return new Storage()
  }
}

async function downloadFromFilenames (storage: IStorage, filenames: string[]): Promise<string[]> {
  return await Promise.all(filenames.map(async (f) => await downloadFromFilename(storage, f)))
}

async function downloadFromFilename (storage: IStorage, filename: string): Promise<string> {
  try {
    const response = await storage.bucket(bucket).file(filename).download()
    return response.toString()
  } catch (e) {
    return '[]'
  }
}

export { downloadFromFilename, downloadFromFilenames, newStorage }
