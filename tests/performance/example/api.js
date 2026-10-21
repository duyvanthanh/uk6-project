import {
  assertStatus, createScenario, createStep, flow, setups, teardowns,
} from '@duy247/uk6/k6-framework';
import { getItems } from 'src/endpoints/example';
import { buildOptions } from 'tests/config';

export const options = buildOptions();

const checks = [
  assertStatus(200),
  {
    name: 'body is a JSON array',
    condition: (response) => {
      try {
        return Array.isArray(JSON.parse(response.body));
      } catch {
        return false;
      }
    },
  },
];

export const { setup, runScenario, teardown } = createScenario({
  flowName: 'Example API flow',
  plan: [
    setups([createStep({ name: 'Check API availability', endpoint: getItems, checks })]),
    flow([
      createStep({
        name: 'Get items',
        endpoint: getItems,
        preprocessor: () => getItems({ params: { limit: 10 } }),
        checks,
      }),
    ]),
    // Add cleanup steps here if your own API example needs them.
    teardowns([]),
  ],
});
