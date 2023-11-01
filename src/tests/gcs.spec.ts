import { MockStorage } from 'mock-gcs'
import { downloadFromFilename, downloadFromFilenames } from '../gcs'
import {BUCKET_NAME} from '../config'

const storage = new MockStorage()

describe('gcs', () => {
  describe('downloadFromFilename', () => {
    it('Responds string when exists', async () => {
      await storage.bucket(BUCKET_NAME).file('a').save('test')
      expect(await downloadFromFilename(storage, 'a')).toBe('test')
    })
    it('Responds string when not exists', async () => {
      const response = await downloadFromFilename(storage, 'b')
      expect(response).toBe('[]')
    })
  })
  describe('downloadFromFilenames', () => {
    it('Responds array string when exists', async () => {
      await storage.bucket(BUCKET_NAME).file('a').save('test')
      await storage.bucket(BUCKET_NAME).file('b').save('other')

      const response = await downloadFromFilenames(storage, ['a', 'b'])
      expect(response).toStrictEqual(['test', 'other'])
    })
    it('Responds array string when not exists', async () => {
      const response = await downloadFromFilenames(storage, ['y', 'z'])
      expect(response).toStrictEqual(['[]', '[]'])
    })
  })
})
