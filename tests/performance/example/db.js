import sql from 'k6/x/sql';
import oracle from 'k6/x/sql/driver/oracle';
import {
  assertPath, assertStatus, createDbStep, createOracleDsn,
  createScenario, createSql, flow, setups,
} from '@duy247/uk6/k6-framework';
import { Common } from 'src/constants';
import { DB } from 'src/query';
import { buildOptions } from 'tests/config';

export const options = buildOptions(__ENV.PLAN || 'smoke', { database: true });

const db = sql.open(oracle, createOracleDsn({
  user: Common.DB_USER,
  password: Common.DB_PASSWORD,
  host: Common.DB_HOST,
  port: Common.DB_PORT,
  service: Common.DB_SERVICE,
}));

const selectExample = createSql({
  db,
  name: 'Example read-only query',
  query: () => DB.oracle.queryExample(),
  timeout: Common.DB_TIMEOUT,
  baseTags: { component: 'db' },
});

const checks = [assertStatus(0), assertPath('rows.0.EXAMPLE_VALUE', 1)];

const scenario = createScenario({
  flowName: 'Example database flow',
  plan: [
    setups([createDbStep({ name: 'Check database connection', query: selectExample, checks })]),
    flow([createDbStep({ name: 'Run example SELECT', query: selectExample, checks })]),
  ],
});

export const setup = scenario.setup;
export const runScenario = scenario.runScenario;

export function teardown(data) {
  try {
    scenario.teardown(data);
  } finally {
    db.close();
  }
}
