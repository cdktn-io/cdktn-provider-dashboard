# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **CDKTN prebuilt provider dashboard** — a static site that displays the health/status of all CDKTN pre-built providers across multiple package managers (npm, PyPI, Go, Maven Central, NuGet). The dashboard is built with [11ty (Eleventy)](https://www.11ty.dev/) and styled with Tailwind CSS. It is deployed to GitHub Pages.

## Build & Development Commands

```bash
# Install dependencies
yarn install

# Local dev server (11ty + Tailwind watch mode)
yarn serve
# Then visit http://localhost:8080/cdktn-provider-dashboard/

# Production build (clean + build 11ty + build CSS)
yarn build

# Debug 11ty
yarn debug

# Refresh data from GitHub API (requires a GitHub token)
GITHUB_TOKEN=$(gh auth token) node ./scripts/collect-status.js
```

There are no tests in this project.

## Architecture

### Data Pipeline

1. **`scripts/collect-status.js`** — Fetches live data from GitHub API and package registries. For each provider repo in the `cdktn-io` GitHub org, it collects: workflow run statuses, open issues/PRs, latest release, package.json contents, latest Terraform provider version, and published versions across 5 package managers (npm, PyPI, Go, Maven Central, NuGet). Output is written to `src/_data/repos.json`.

2. **`src/_data/repos.json`** — Snapshot of collected data. Committed to the repo so local dev doesn't require API calls. The `update-data.yml` workflow refreshes this weekly via automated PR.

3. **`src/_data/config.json`** — Contains `{ "org": "cdktn-io" }`, the GitHub org to query.

### Static Site (11ty)

- **`.eleventy.js`** — Eleventy config. Registers custom filters and shortcodes. Input dir is `src/`, layouts in `src/_layouts/`, data in `src/_data/`. Path prefix is `/cdktn-provider-dashboard/`.
- **`src/index.njk`** — Main dashboard template (Nunjucks). Renders a card for each provider showing: release version, provider version drift, package manager versions, workflow statuses, issue/PR counts.
- **`src/_layouts/base.njk`** — HTML shell with Tailwind CSS link.

### Custom 11ty Filters (`src/filters/`)

- **`sortRepos.js`** — Sorts providers by "most problematic first" (failing workflows > major version drift > package manager lag > issues/PRs), archived repos go last.
- **`sortWorkflows.js`** — Alphabetically sorts workflow entries for display.
- **`daysAgo.js`** — Converts ISO date to relative time string using Luxon.
- **`semverCompare.js`** — Returns true if two versions differ by a major version (used to flag alerts).

### Custom 11ty Shortcodes (`src/shortcodes/`)

- **`githubIcon.js`** — Reads SVG files from `@primer/octicons` and inlines them.

### Key Scripts

- **`scripts/collect-status.js`** — Main data collector (see above). Queries the `cdktn-io` GitHub org. Uses Octokit with throttling and retry plugins. Can run authenticated (via `GITHUB_TOKEN`) or unauthenticated (with 5s delays between repos for rate limiting).
- **`scripts/perform-pr-action.js`** — Utility to bulk-search and reopen closed PRs. Not part of the regular build pipeline.

### CI/CD (`.github/workflows/`)

- **`build.yml`** — Runs hourly (cron) and on push/PR. Collects fresh data, builds the site, and deploys to GitHub Pages on main.
- **`update-data.yml`** — Weekly cron to refresh `src/_data/repos.json` and open a PR with updated data.

## Important Patterns

- The `pathPrefix` in `.eleventy.js` is set to `/cdktn-provider-dashboard/` — this affects all URL generation and must match the GitHub Pages deployment path.
- Provider name mapping logic in `collect-status.js` (`convertRepoNameForLanguage`) handles language-specific package naming conventions with special overrides (e.g., `googlebeta`).
- Version `999.999.999` is used as a sentinel value throughout the codebase to indicate "no release found" or "unable to fetch".
- The build output goes to `_site/` (gitignored).
- The `packageJson.cdktf` config key in provider repos retains the `cdktf` name for backwards compatibility — do NOT rename property accesses like `repo.packageJson.cdktf.provider.version`.
- Both `cdktn` and `cdktf` peer dependency versions are detected in the dashboard display.
