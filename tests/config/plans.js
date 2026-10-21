import { Common } from 'src/constants';

export const plans = {
  smoke: {
    executor: 'shared-iterations',
    vus: 1,
    iterations: 1,
    tags: { test_type: 'smoke' },
  },
  load: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '10s', target: 5 },
      { duration: '20s', target: 5 },
      { duration: '10s', target: 0 },
    ],
    tags: { test_type: 'load' },
  },
};

export function buildOptions(planName = __ENV.PLAN || 'smoke', { database = false } = {}) {
  if (!Object.prototype.hasOwnProperty.call(plans, planName)) {
    throw new Error(`Unknown PLAN: ${planName}. Choose smoke or load.`);
  }
  return {
    scenarios: {
      example: { exec: 'runScenario', gracefulStop: '30s', ...plans[planName] },
    },
    thresholds: {
      checks: ['rate==1'],
      ...(database ? {} : { http_req_failed: ['rate==0'] }),
    },
    tags: {
      environment: Common.TEST_ENV,
      service: database ? 'example-db' : 'example-api',
    },
  };
}
