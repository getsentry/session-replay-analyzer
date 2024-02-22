#!/bin/bash

/devinfra/scripts/checks/googlecloud/checkcloudbuild.py \
  "${GO_REVISION_SESSION_REPLAY_ANALYZER_REPO}" \
  internal-sentry \
  "us.gcr.io/internal-sentry/session-replay-analyzer"