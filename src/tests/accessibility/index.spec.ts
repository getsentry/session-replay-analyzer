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
    const data = fs.readFileSync(path.join(__dirname, '../../../mock/rrweb-sentry.json'))
    await storage.bucket(BUCKET_NAME).file('test.json').save(zlib.gzipSync(data))

    const browser = await playwright.chromium.launch({ headless: true })
    const page = await newPlayerPage(browser)
    const result = await runA11Y(storage, page, ['test.json'])
    await browser.close()

    expect(result.length).toBe(2)
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
