import * as playwright from 'playwright'
import { newPlayerPage } from '../../player'
import { MockStorage } from 'mock-gcs'
import { coerceTimestamp, runA11Y } from '../../accessibility/index'
import fs from 'fs'
import path from 'path'
import {BUCKET_NAME} from '../../config'
import zlib from 'zlib'

const storage = new MockStorage()

describe('runA11Y', () => {
  it('works', async () => {
    const data = fs.readFileSync(path.join(__dirname, '../../../mock/rrweb-simple.json'))
    await storage.bucket(BUCKET_NAME).file('test.json').save(zlib.gzipSync(data))

    const browser = await playwright.chromium.launch({ headless: true })
    try {
      const page = await newPlayerPage(browser)
      const result = await runA11Y(storage, page, ['test.json'])
      expect(result.length).toBe(4)
    } catch (e) {
      console.log(e)
      expect(1).toBe(2)
    } finally {
      await browser.close()
    }
  })
})

describe('coerceTimestamp', () => {
  it('succeeds no matter what', async () => {
    expect(coerceTimestamp(123)).toEqual(123)
    expect(coerceTimestamp('123')).toEqual(123)
    expect(coerceTimestamp(123.12)).toEqual(123.12)
    expect(coerceTimestamp('123.12')).toEqual(123.12)
    expect(coerceTimestamp('abc')).toEqual(0)
    expect(coerceTimestamp(undefined)).toEqual(0)
    expect(coerceTimestamp({})).toEqual(0)
    expect(coerceTimestamp([])).toEqual(0)
    expect(coerceTimestamp(false)).toEqual(0)
    expect(coerceTimestamp(null)).toEqual(0)
  })
})

describe('runA11YLargeReplay', () => {
  fit('works', async () => {
    const data = fs.readFileSync(path.join(__dirname, '../../../mock/events.json'))
    await storage.bucket(BUCKET_NAME).file('test.json').save(zlib.gzipSync(data))

    console.time('launch')
    const browser = await playwright.chromium.launch({ headless: true })
    console.timeEnd('launch')
    try {
      console.time('newPlayerPage')
      const page = await newPlayerPage(browser)
      console.timeEnd('newPlayerPage')
      console.time('runA11Y')
      const result = await runA11Y(storage, page, ['test.json'])
      console.timeEnd('runA11Y')
      // expect(result.length).toBe(4)
    } catch (e) {
      console.log(e)
      expect(1).toBe(2)
    } finally {
      await browser.close()
    }
  }, 1000000)
})
