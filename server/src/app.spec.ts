import fs from 'fs'
import path from 'path'
import supertest from 'supertest'
import { app, storage } from './app'

describe('healthcheck', () => {
  describe('GET /api/healthcheck/live', () => {
    it('Responds 200 OK when configured', async () => {
      const resp = await supertest(app).get('/api/healthcheck/live/').send()
      expect(resp.status).toBe(200)
      expect(resp.text).toBe('OK')
    })
  })
})

describe('accessibility analysis endpoint', () => {
  describe('POST', () => {
    it('Responds 201 created', async () => {
      const data = fs.readFileSync(path.join(__dirname, '../mock/rrweb-sentry.json'))
      await storage.bucket('bucket_name').file('test.json').save(data)

      const resp = await supertest(app)
        .post('/api/0/analyze/accessibility')
        .send({ data: { filenames: ['test.json'] } })

      expect(resp.status).toBe(201)

      const response = JSON.parse(resp.text)
      expect(response.meta).toEqual({ total: 2 })
      expect(response.data.length).toEqual(2)
    })
  })
})
