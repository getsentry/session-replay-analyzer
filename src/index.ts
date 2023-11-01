import { app } from './app'
import * as Sentry from "@sentry/node";
import {SENTRY_DSN, SENTRY_SAMPLE_RATE} from './config'

if (SENTRY_DSN !== "") {
    Sentry.init({
        dsn: SENTRY_DSN,
        tracesSampleRate: SENTRY_SAMPLE_RATE,
    });
}

const port = 3000
app.listen(port, () => { console.log(`Running forever at http://localhost:${port}`) })
