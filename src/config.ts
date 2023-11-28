const BUCKET_NAME = process.env.BUCKET_NAME || "default"
const ENVIRONMENT = process.env.NODE_ENV || ""
const SENTRY_DSN = process.env.SENTRY_DSN || ""
const SENTRY_TRACE_SAMPLE_RATE = parseFloat(process.env.SENTRY_TRACE_SAMPLE_RATE || "1.0")
const SENTRY_PROFILE_SAMPLE_RATE = parseFloat(process.env.SENTRY_PROFILE_SAMPLE_RATE || "0.1")
// Max number of segments to playback
const REPLAY_MAX_SEGMENT = parseInt(process.env.SENTRY_PROFILE_SAMPLE_RATE || "5")

export { BUCKET_NAME, ENVIRONMENT, SENTRY_DSN, SENTRY_TRACE_SAMPLE_RATE, SENTRY_PROFILE_SAMPLE_RATE, REPLAY_MAX_SEGMENT }
