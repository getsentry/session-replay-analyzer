import { app } from './app'
import {SENTRY_DSN, SENTRY_TRACE_SAMPLE_RATE, SENTRY_PROFILE_SAMPLE_RATE} from './config'
import * as Sentry from "@sentry/node";
import { ProfilingIntegration } from "@sentry/profiling-node";


Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Sentry.Integrations.Express({ app }),
        new ProfilingIntegration(),
    ],
    tracesSampleRate: SENTRY_TRACE_SAMPLE_RATE,
    profilesSampleRate: SENTRY_PROFILE_SAMPLE_RATE,
});


const port = 3000
app.listen(port, () => { console.log(`Running forever at http://localhost:${port}`) })
