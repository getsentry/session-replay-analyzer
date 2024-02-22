local gocdtasks = import 'github.com/getsentry/gocd-jsonnet/libs/gocd-tasks.libsonnet';

function(region) {
  environment_variables: {
    // SENTRY_REGION is used by the dev-infra scripts to connect to GKE
    SENTRY_REGION: region,
  },
  materials: {
    'session-replay-analyzer_repo': {
      git: 'git@github.com:getsentry/session-replay-analyzer.git',
      shallow_clone: true,
      branch: 'main',
      destination: 'session-replay-analyzer',
    },
  },
  lock_behavior: 'unlockWhenFinished',
  stages: [
    {
      checks: {
        fetch_materials: true,
        jobs: {
          checks: {
            environment_variables: {
              GITHUB_TOKEN: '{{SECRET:[devinfra-github][token]}}',
            },
            timeout: 1200,
            elastic_profile_id: 'session-replay-analyzer',
            tasks: [
              gocdtasks.script(importstr '../bash/check-github-runs.sh'),
              gocdtasks.script(importstr '../bash/check-cloudbuild.sh'),
            ],
          },
        },
      },
    },
    {
      deploy_canary: {
        fetch_materials: true,
        jobs: {
          deploy: {
            timeout: 1200,
            elastic_profile_id: 'session-replay-analyzer',
            environment_variables: {
              LABEL_SELECTOR: 'service=replay-analyzer,env=canary',
            },
            tasks: [
              gocdtasks.script(importstr '../bash/deploy.sh'),
              gocdtasks.script(importstr '../bash/wait-canary.sh'),
            ],
          },
        },
      },
    },
    {
      'deploy-primary': {
        fetch_materials: true,
        jobs: {
          deploy: {
            timeout: 1200,
            elastic_profile_id: 'session-replay-analyzer',
            environment_variables: {
              LABEL_SELECTOR: 'service=replay-analyzer',
            },
            tasks: [
              gocdtasks.script(importstr '../bash/deploy.sh'),
            ],
          },
        },
      },
    },
  ],
}
