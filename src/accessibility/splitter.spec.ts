import { split } from './splitter'

describe('splitter', () => {
  describe('split valid', () => {
    it('succeeds', async () => {
      const a = split(['[{"type": 2}]'])
      expect(a).toEqual([{ type: 2 }])
    })
  })
  describe('split invalid', () => {
    it('ignores something', async () => {
      expect(split(['[{"key": "value"}]'])).toEqual([])
    })
    it('ignores non-array types', async () => {
      expect(split(['{"type": 2}'])).toEqual([])
    })
    it('ignores non-full-snapshot types', async () => {
      expect(split(['{"type": 1}'])).toEqual([])
    })
    it('ignores invalid types', async () => {
      expect(split(['"abc"'])).toEqual([])
    })
    it('ignores invalid json', async () => {
      expect(split(['abc'])).toEqual([])
    })
  })
})
