#!/bin/bash

/devinfra/scripts/checks/githubactions/checkruns.py \
  getsentry/session-replay-analyzer \
  "${GO_REVISION_SESSION_REPLAY_ANALYZER_REPO}" \
  "build-image (amd64)"
