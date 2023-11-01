import { app } from './app'
import * as Sentry from "@sentry/node";

const sentry_dsn = process.env.SENTRY_DSN || ""
const sample_rate = parseFloat(process.env.SENTRY_TRACE_SAMPLE_RATE || "0")

if (sentry_dsn !== "") {
    Sentry.init({
        dsn: sentry_dsn,
        tracesSampleRate: sample_rate,
    });
}

const port = 3000
app.listen(port, () => { console.log(`Running forever at http://localhost:${port}`) })
