import { createEndpoint } from '@duy247/uk6/k6-framework';
import { JsonPlaceholder } from 'src/constants';

const defaults = {
  baseUrl: JsonPlaceholder.BASE_URL,
  defaultHeaders: () => ({ Accept: 'application/json', 'Content-Type': 'application/json' }),
};

export const getPost = createEndpoint({
  ...defaults, path: `${JsonPlaceholder.POSTS_PATH}/1`, method: 'GET', name: 'JSONPlaceholder: Get post',
});
export const getPosts = createEndpoint({
  ...defaults, path: JsonPlaceholder.POSTS_PATH, method: 'GET', name: 'JSONPlaceholder: List posts',
});
export const createPost = createEndpoint({
  ...defaults, path: JsonPlaceholder.POSTS_PATH, method: 'POST', name: 'JSONPlaceholder: Create post',
});
