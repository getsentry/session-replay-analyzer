import { coerceTimestamp, processViolations } from './index'

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
