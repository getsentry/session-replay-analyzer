local session_replay_analyzer = import './pipelines/session-replay-analyzer.libsonnet';
local pipedream = import 'github.com/getsentry/gocd-jsonnet/libs/pipedream.libsonnet';

// Pipedream can be configured using this object, you can learn more about the
// configuration options here: https://github.com/getsentry/gocd-jsonnet#readme
local pipedream_config = {
  name: 'session-replay-analyzer',
  auto_deploy: true,
  exclude_regions: [
    's4s',
    'customer-1',
    'customer-2',
    'customer-3',
    'customer-4',
    'customer-6',
  ],
  materials: {
    'session-replay-analyzer_repo': {
      git: 'git@github.com:getsentry/session-replay-analyzer.git',
      shallow_clone: true,
      branch: 'main',
      destination: 'session-replay-analyzer',
    },
  },
};

pipedream.render(pipedream_config, session_replay_analyzer)
