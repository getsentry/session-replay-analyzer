import { MockStorage } from 'mock-gcs'
import { downloadFromFilename, downloadFromFilenames } from './gcs'

const storage = new MockStorage()

describe('gcs integration', () => {
  describe('GET filename', () => {
    it('Responds string when exists', async () => {
      await storage.bucket('bucket_name').file('a').save('test')
      expect(await downloadFromFilename(storage, 'a')).toBe('test')
    })
    it('Responds string when not exists', async () => {
      const response = await downloadFromFilename(storage, 'b')
      expect(response).toBe('[]')
    })
  })
  describe('GET filenames', () => {
    it('Responds array string when exists', async () => {
      await storage.bucket('bucket_name').file('a').save('test')
      await storage.bucket('bucket_name').file('b').save('other')

      const response = await downloadFromFilenames(storage, ['a', 'b'])
      expect(response).toStrictEqual(['test', 'other'])
    })
  })
})
