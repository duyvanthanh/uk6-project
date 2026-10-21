# uk6 example project

Requires Node.js 22+, npm and k6 on PATH (for example `$HOME/.local/bin`).
Run `npm install` to install the prebuilt npm package `@duy247/uk6@^0.1.0` from the registry. No Git clone or consumer build step is needed.
The package keeps the `uk6` and `uk6-distributed-listener` CLI names.

Start the supplied mock from the workspace root:

```sh
node verification/mock-server.mjs
```

In another terminal, from uk6-project (POSIX shell):

```sh
export PATH="$HOME/.local/bin:$PATH"
export BASE_URL=http://127.0.0.1:18765
npx uk6 tests/performance/example/api.js --k6=local
npx uk6 tests/performance/example/concurrent-api.js --k6=local
```

PowerShell equivalents:

```powershell
$env:BASE_URL = 'http://127.0.0.1:18765'
npx uk6 tests/performance/example/api.js --k6=local
npx uk6 tests/performance/example/concurrent-api.js --k6=local
```

BASE_URL takes precedence over the legacy API_BASE_URL; default is
http://127.0.0.1:8080. Copy .env.example to .env.local and pass --env=local
for file-based configuration. PLAN defaults to smoke (one VU, one iteration);
load ramps to five VUs over 40 seconds. All checks and HTTP error thresholds must pass.

The API exposes GET /items returning a JSON array; concurrent requests use page=1
and page=2. The sequential scenario checks availability then requests limit=10.

The database example requires Oracle (default localhost:1521/FREEPDB1), credentials
DB_USER and DB_PASSWORD, and a k6 build with k6/x/sql and k6/x/sql/driver/oracle
plus the Oracle driver's runtime prerequisites. It only runs
SELECT 1 AS EXAMPLE_VALUE FROM dual, checks the value, and closes the connection.
Run `npm run example:db -- --env=local --k6=local` after supplying those dependencies.
Bundling alone does not establish database connectivity.

Source layout: src/constants (API/DB settings), src/endpoints/example (HTTP endpoint),
src/query/DB/oracle (SQL), tests/config (plans), tests/performance/example (scenarios).
The runner resolves src/* and tests/* aliases. Use `npx uk6 --help` for runner flags.
Distributed shared directories must use a path accessible on each participant's OS;
Windows UNC paths are optional deployment configuration, not required for local runs.

Run `npm run example:public-api` for the real JSONPlaceholder API example: GET a post, GET the list, and POST a post, exactly 5 iterations with 1 VU, with status/body checks and dashboard output at `dashboard-report/api_dashboard.html`. JSONPlaceholder simulates creation without persisting the post (https://jsonplaceholder.typicode.com/).
