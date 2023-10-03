import supertest from 'supertest'
import { app } from './app'

describe('healthcheck', () => {
  describe('GET /api/healthcheck', () => {
    it('Responds 200 OK when configured', async () => {
      const resp = await supertest(app).get('/api/healthcheck').send()
      expect(resp.status).toBe(200)
      expect(resp.text).toBe('OK')
    })
  })
})

describe('accessibility analysis endpoint', () => {
  describe('POST', () => {
    it('Responds 201 created', async () => {
      const resp = await supertest(app)
        .post('/api/0/analyze/accessibility')
        .send({data: {filenames: ["a"]}})

      expect(resp.status).toBe(201)
      expect(resp.text).toBe('{"meta":{"total":0},"data":[]}')
    })
  })
})
