import {
  assertStatus, concurrent, createScenario, createStep,
} from '@duy247/uk6/k6-framework';
import { getItems } from 'src/endpoints/example';
import { buildOptions } from 'tests/config';

export const options = buildOptions();

export const { setup, runScenario, teardown } = createScenario({
  flowName: 'Example concurrent API flow',
  plan: [
    concurrent([
      createStep({
        name: 'Get first page',
        endpoint: getItems,
        preprocessor: () => getItems({ params: { page: 1 } }),
        checks: [assertStatus(200)],
      }),
      createStep({
        name: 'Get second page',
        endpoint: getItems,
        preprocessor: () => getItems({ params: { page: 2 } }),
        checks: [assertStatus(200)],
      }),
    ], 'Fetch pages in parallel'),
  ],
});
