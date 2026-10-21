import { createEndpoint } from '@duy247/uk6/k6-framework';
import { Example } from 'src/constants';

export const getItems = createEndpoint({
  baseUrl: Example.API_BASE_URL,
  path: Example.ITEMS_PATH,
  method: 'GET',
  name: 'Example: Get items',
  defaultHeaders: () => ({ Accept: 'application/json' }),
});
