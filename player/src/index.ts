import Player from 'rrweb-player'

// Requires at least two events to run.
function playEvents (events: any[]): void {
  // Reset inner body for subsequent runs.
  document.body.innerHTML = ''

  const player = new Player({
    target: document.body,
    props: {
      events,
      speed: 999999,
      speedOption: [999999],
      skipInactive: true,
      showWarning: false,
      loadTimeout: 1000 // timeout to load the stylesheet(s)
    }
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
