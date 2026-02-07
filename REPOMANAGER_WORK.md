# Repo Manager Scope: cdktn-provider-dashboard

Scope of work for adding `cdktn-provider-dashboard` to `cdktn-repository-manager` management.

## What the repo manager should provide

Per the `CustomConstructsStack` pattern in `main.ts` (line 272+) and `lib/repository.ts`:

1. **Secrets** — `GH_APP_ID` and `GH_APP_PRIVATE_KEY` (needed by `auto-approve.yml`, `automerge.yml`, `update-data.yml`)
2. **Branch protection on `main`** — require 1 approval, linear history, no force push, status checks
3. **Labels** — `automerge`, `auto-approve`, `no-auto-close`
4. **Webhooks** — Slack integration for issues (if desired)
5. **Vulnerability alerts** — enable

## How to add it

In `/root/cdktn/cdktn-repository-manager/main.ts`, the `CustomConstructsStack` is initialized at line ~418 with an empty array:

```typescript
new CustomConstructsStack(app, "custom-constructs", []);
```

A new entry would be added for the dashboard repo, using `GithubRepositoryFromExistingRepository` + `RepositorySetup` pattern (similar to lines 305-359). The dashboard doesn't publish packages, so it only needs the GH App secrets subset (not NPM/PyPI/Go tokens).

## Workflows affected by missing secrets

| Workflow | Status | Missing Secrets |
|----------|--------|-----------------|
| `build.yml` | **Works** | None (uses built-in `GITHUB_TOKEN`) |
| `pr-copyright.yml` | **Works** | None |
| `auto-approve.yml` | Blocked | `GH_APP_ID`, `GH_APP_PRIVATE_KEY` |
| `automerge.yml` | Blocked | `GH_APP_ID`, `GH_APP_PRIVATE_KEY` |
| `update-data.yml` | PR creation blocked | `GH_APP_ID`, `GH_APP_PRIVATE_KEY` |

**Impact:** The hourly build+deploy pipeline works immediately. Only the weekly auto-update-data PR flow and auto-merge/approve are blocked until secrets are provisioned.
