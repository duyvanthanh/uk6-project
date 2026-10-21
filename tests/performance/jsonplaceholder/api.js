import { assertStatus, createScenario, createStep, flow } from '@duy247/uk6/k6-framework';
import { JsonPlaceholder } from 'src/constants';
import { getPost, getPosts, createPost } from 'src/endpoints/jsonplaceholder';
import { buildOptions } from 'tests/config';

export const options = {
  ...buildOptions(),
  scenarios: {
    public_api: { executor: 'shared-iterations', exec: 'runScenario', vus: 1, iterations: 5, maxDuration: '2m' },
  },
  tags: { service: 'jsonplaceholder', environment: 'public' },
};

function bodyCheck(name, predicate) {
  return {
    name,
    condition: (response) => {
      try { return predicate(JSON.parse(response.body)); } catch { return false; }
    },
  };
}

export const { setup, runScenario, teardown } = createScenario({
  flowName: 'JSONPlaceholder public API',
  plan: [flow([
    createStep({
      name: 'Get post 1', endpoint: getPost,
      checks: [assertStatus(200), bodyCheck('post 1 has expected fields',
        (post) => post.id === 1 && post.userId === 1 && typeof post.title === 'string' && post.title.length > 0 && typeof post.body === 'string')],
    }),
    createStep({
      name: 'List posts', endpoint: getPosts,
      checks: [assertStatus(200), bodyCheck('list contains 100 valid posts',
        (posts) => Array.isArray(posts) && posts.length === 100 && posts.every((post) => Number.isInteger(post.id) && typeof post.title === 'string' && typeof post.body === 'string'))],
    }),
    createStep({
      name: 'Create post', endpoint: createPost,
      preprocessor: () => createPost({ body: JsonPlaceholder.EXAMPLE_POST }),
      checks: [assertStatus(201), bodyCheck('created post echoes payload and has id 101',
        (post) => post.id === 101 && post.title === JsonPlaceholder.EXAMPLE_POST.title && post.body === JsonPlaceholder.EXAMPLE_POST.body && post.userId === JsonPlaceholder.EXAMPLE_POST.userId)],
    }),
  ])],
});
