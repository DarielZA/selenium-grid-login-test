# Selenium Grid Demo

A small Selenium WebDriver (JavaScript) example of a login test that runs against a Selenium Grid defined in Docker Compose.

The test opens [SauceDemo](https://www.saucedemo.com/), logs in as `standard_user` and checks that the inventory page loads. If the check fails, the run exits with a non-zero code, so a CI job or script can see the failure.

This is a practice project with one scenario, not a full test suite.

## What is in the repo

| Path | Purpose |
| --- | --- |
| `docker-compose.yml` | Selenium Hub and one Chrome node (version 4.17.0) |
| `config/webdriver-simple-config.js` | Creates the remote driver for `http://localhost:4444/wd/hub` |
| `tests/reliable-chrome-test.js` | The login test |

## Run it

Requirements: Docker with Docker Compose, Node.js, and `curl` and `jq` for the ready check.

```bash
npm ci
docker compose up -d

# Wait until the Chrome node has registered with the hub (up to about 60 seconds)
for i in $(seq 1 30); do
  curl -sf http://localhost:4444/status | jq -e '.value.nodes[0].availability == "UP"' > /dev/null && break
  sleep 2
done

npm test
docker compose down
```

The test prints `Login exitoso - prueba pasada` when it passes. When it fails, it prints the error and exits with code 1.

The Grid ready check is needed because the test can start before the Chrome node has registered.

## Test status

- The Docker Compose setup and login test passed in GitHub Actions. See this [recorded passing run](https://github.com/DarielZA/selenium-grid-demo/actions/runs/42150366176). Check the Actions tab for newer results.
- Failure handling was also checked with an invalid username using local Chrome and a Selenium Grid 4.17.0 server: the test exits with code 1. The CI workflow currently runs only the valid-login scenario.

## Limits and safety

- This is one login scenario against a public demo site, not a full test suite. Runs depend on that site being available.
- The Grid has no authentication. The Compose file publishes port 4444 on 127.0.0.1 only and does not publish the VNC port. Keep these restrictions; do not expose the Grid to the internet.
- Use Docker Engine 28 or newer. Older versions have a documented issue that can let other devices on the same network reach ports published to localhost. See [Docker's port-publishing guidance](https://docs.docker.com/engine/network/port-publishing/).
- Software running on the same computer can still connect to the Grid. Stop the containers with docker compose down when finished.
