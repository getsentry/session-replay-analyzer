import express, { type Request, type Response } from 'express'
import * as playwright from 'playwright'
import { runA11Y } from './accessibility'
import { newPlayerPage } from './player'
import { newStorage } from './gcs'

const storage = newStorage()

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/healthcheck/live', (req, res) => {
  res.status(200).send('OK')
})

interface TypedRequest<T> extends Request {
  body: T
}

interface AnalyzeAcessibilityBody {
  data: AnalyzeAcessibilityBodyData
}

interface AnalyzeAcessibilityBodyData {
  filenames: string[]
}

app.post('/api/:version/analyze/accessibility', async (req: TypedRequest<AnalyzeAcessibilityBody>, res: Response) => {
  const body = req.body
  const browser = await playwright.chromium.launch({ headless: true })
  const page = await newPlayerPage(browser)
  const results = await runA11Y(storage, page, body.data.filenames)
  res.status(201).send(JSON.stringify({
    meta: { total: results.length },
    data: results
  }))
  await browser.close()
})

export { app, storage }