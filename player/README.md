# RRWeb Player Environment

To play a replay on the server several things must happen. One of those things is creating an environment capable of accepting RRWeb events.

This module defines a broken `index.html` with a dependency on a file that does not exist. It should never be used. Instead build the project and open `dist/index.html`.

## Build

In the `player` folder run: `$ npm run build`

## Usage

After building the file. Open `player/dist/index.html` in a web browser. In the console you should have access to `window.playEvents`.
