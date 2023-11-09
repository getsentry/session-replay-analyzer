import Player from 'rrweb-player'

// Requires at least two events to run.
function playEvents (events: any[]): void {
  // Reset inner body for subsequent runs.
  document.body.innerHTML = ''

  const player = new Player({
    target: document.body,
    props: {
      events,
      speed: 99999999999,
      speedOption: [99999999999],
      skipInactive: true,
      showWarning: false,
      loadTimeout: 0,
    }
  })

  // When the player reaches the end-state we can run axe-core.
  player.addEventListener("ui-update-progress", (state) => {
    if (state.payload == 1) {
      console.log("FINISHED")
    }
  })

  player.play()

  // Run for at most 1000ms.
  setTimeout(() => {console.log("FINISHED")}, 1000)
}

// Expose the "playEvents" function on the window. Playwright will host
// the environment while our node service both injects rrweb-events and
// plays the replay using this function.
//
// We're just trying to render HTML on the screen so we can run so we
// can execute some library against it.
(window as any).playEvents = playEvents
