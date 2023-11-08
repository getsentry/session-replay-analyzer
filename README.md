# Session Replay Analyzer

Session Replay analysis service.

## Build

```bash
npm run build --prefix player
cp player/player.js player.js
npm run build
```

- Changes to the player must be built and copied manually. CI will not do it for you.
  - Feel free to fix this.
- A test player exists at player/index.html. Open it in your browser.
- Inject events by calling `window.playEvents([{event...}, {event...}])`
- The easiest way to inject a large amount of json is to update index.html and extract the innerContent of the element containing the events. Parse the json then ingest. I know this is weird but its better than alternatives.

## Server

Node.js REST API. Responsible for playing RRWeb events.

## Player

The `player` module produces an HTML page which can be used to test RRWeb events. This page is loaded by playwright in the `server` module.

## Locust

The `locust` module contains scripts for load-testing the service. Instructions for running a load-test can be found in `locust/README.md`.
