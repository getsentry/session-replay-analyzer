# Session Replay Analyzer

Session Replay analysis service.

## Server

Node.js REST API. Responsible for playing RRWeb events.

## Player

The `player` module produces an HTML page which can be used to test RRWeb events. This page is loaded by playwright in the `server` module.

## Locust

The `locust` module contains scripts for load-testing the service. Instructions for running a load-test can be found in `locust/README.md`.
