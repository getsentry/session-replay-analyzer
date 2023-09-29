import { Replayer } from '@sentry-internal/rrweb'

// Requires at least two events to run.
function playEvents (events: any[]): void {
  const player = new Replayer(events, {
    root: document.body,
    speed: 999999,
    skipInactive: true,
    showWarning: false,
    loadTimeout: 1000 // timeout to load the stylesheet(s)
  })
  player.play()
}

// Expose the "playEvents" function on the window. Playwright will host
// the environment while our node service both injects rrweb-events and
// plays the replay using this function.
//
// We're just trying to render HTML on the screen so we can run so we
// can execute some library against it.
(window as any).playEvents = playEvents
