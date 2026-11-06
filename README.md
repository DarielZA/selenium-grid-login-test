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

- Verified: the test passes with a valid login and fails with exit code 1 with an invalid user, using local Chrome and a Selenium Grid 4.17.0 server.
- Not yet verified: the exact Docker Compose setup in this repo. A GitHub Actions workflow to run it is planned and has not been added yet.

## Limits

- One scenario against a public demo site, so the run depends on that site being available.
- The Grid is meant for local use.

