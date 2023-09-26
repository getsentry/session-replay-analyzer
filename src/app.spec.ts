import supertest from 'supertest'
import { app } from './app.js'

describe('healthcheck', () => {
  describe('GET /api/healthcheck', () => {
    it('Responds 200 OK when configured', async () => {
      const resp = await supertest(app).get('/api/healthcheck').send()
      expect(resp.status).toBe(200)
      expect(resp.text).toBe('OK')
    })
  })
})
