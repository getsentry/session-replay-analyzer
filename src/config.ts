const BUCKET_NAME = process.env.BUCKET_NAME || "default"
const ENVIRONMENT = process.env.NODE_ENV || ""
const SENTRY_DSN = process.env.SENTRY_DSN || ""
const SENTRY_SAMPLE_RATE = parseFloat(process.env.SENTRY_TRACE_SAMPLE_RATE || "1.0")

export { BUCKET_NAME, ENVIRONMENT, SENTRY_DSN, SENTRY_SAMPLE_RATE }
