import express, { type Request, type Response } from 'express'
import * as fs from 'fs'
import * as playwright from 'playwright'
import { runA11Y } from './accessibility'
import { newPlayerPage } from './player'
import { newStorage } from './gcs'
import * as Sentry from "@sentry/node";
import { SENTRY_DSN, SENTRY_TRACE_SAMPLE_RATE, SENTRY_PROFILE_SAMPLE_RATE, ENVIRONMENT } from './config'
import { ProfilingIntegration } from "@sentry/profiling-node";

S

const storage = newStorage()
const app = express()

Sentry.init({
  dsn: SENTRY_DSN,
  environment: ENVIRONMENT,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
    new ProfilingIntegration(),
  ],
  _experiments: { metricsAggregator: true },
  tracesSampleRate: SENTRY_TRACE_SAMPLE_RATE,
  profilesSampleRate: SENTRY_PROFILE_SAMPLE_RATE,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/healthcheck/live', (req, res) => {
  fs.access("/tmp/analyzer.down", fs.constants.F_OK, (err) => {
    if (!err) {
      res.status(502).send('Downfile Exists')
    } else {
      res.status(200).send('OK')
    }
  });
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

app.get('/api/:version/test-playwright', async (req, res) => {
  const browser = await playwright.chromium.launch({ headless: true })
  await browser.close()
  res.status(200).send('OK')
});

app.post('/api/:version/analyze/accessibility', async (req: TypedRequest<AnalyzeAcessibilityBody>, res: Response) => {
  // Capture metrics.
  Sentry.metrics.increment("count_accessibility_analysis", 1);

  const browser = await Sentry.startSpan({ name: "Open Browser" }, async () => {
    return await playwright.chromium.launch({ headless: true })
  })

  try {
    const body = req.body
    const page = await newPlayerPage(browser)
    const results = await runA11Y(storage, page, body.data.filenames)
    res.status(201).send(JSON.stringify({
      meta: { total: results.length },
      data: results
    }))
    Sentry.metrics.increment("count_accessibility_analysis_success", 1);
  } catch (e) {
    console.log(e)
    res.status(500).send(e.toString())
    Sentry.metrics.increment("count_accessibility_analysis_failure", 1);
  } finally {
    await browser.close()
  }
})

app.use(Sentry.Handlers.errorHandler());
app.use(function onError(err, req, res, next) {
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

export { app, storage }
