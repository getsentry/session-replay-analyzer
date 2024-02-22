#!/bin/bash

eval $(/devinfra/scripts/regions/project_env_vars.py --region="${SENTRY_REGION}")

/devinfra/scripts/k8s/k8stunnel \
  && /devinfra/scripts/k8s/k8s-deploy.py \
  --label-selector="${LABEL_SELECTOR}" \
  --image="us.gcr.io/internal-sentry/session-replay-analyzer:${GO_REVISION_SESSION_REPLAY_ANALYZER_REPO}" \
  --container-name="replay-analyzer"
