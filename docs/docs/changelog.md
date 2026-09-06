---
title: Changelog
sidebar_position: 4
description: All notable changes to katanakit-js.
---

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.1] - Unreleased

Current development version. This is the first release published under the
**`katanakit-js`** npm name (previous development releases were published as
`katanakit-dev`).

### Added

- **Vue adapter** — new `katanakit-js/adapters/vue` subpath exporting the
  `useKatanaFetch` composable, which bridges KatanaKit Safe Results to Vue 3
  reactivity (`data`, `error`, `loading`, `refetch`). Accepts a reactive `Ref`
  of `UrlOptions` and refetches automatically on change. `vue` is an optional
  peer dependency.
- **Nuxt adapter** — new `katanakit-js/adapters/nuxt` subpath exporting three
  pure helpers that bridge KatanaKit Safe Results to Nuxt/Nitro server routes:
  `useUnwrap(result, context?)`, `useSafeResponse(result)` and
  `useEventResponse(event, result)`. They avoid a hard dependency on `h3`
  (which ships with Nuxt).
- **Site config and SEO module** — new `src/config/` layer with
  `siteConfig`/`SiteConfig` and pure SEO helpers (`useGenerateMetaTags`,
  `useHeadTags`, `useTitle`, `useRssHeadLink`), re-exported from the main
  barrel. Includes HTML/attribute escaping and JSON-LD breakout protection.
- **`release:*` scripts** — `release:patch`, `release:minor`, `release:major`
  and `release:beta` (tagged `beta`) with a `validate` gate that runs
  Biome, tests and the build before publishing.
- New Vitest suites for RSS, Nuxt, SEO and Vue services (60 tests across 8 files).

### Changed

- **Renamed the npm package** from `katanakit-dev` to **`katanakit-js`**
  (version bumped to 2.2.1). The `exports` map now exposes the root entry plus
  three framework subpaths: `katanakit-js/adapters/express`,
  `katanakit-js/adapters/nuxt` and `katanakit-js/adapters/vue`.
- **Restructured dependencies** — only `@js-temporal/polyfill` remains a
  runtime dependency; `express`, `cors`, `dotenv` and `@prisma/orm-postgres`
  are now **optional peer dependencies** installed only by consumers that use
  the Express adapter or the Prisma layer.
- Upgraded the toolchain: Biome to v2 (migrated `biome.json` schema), Vitest to
  v5, TypeScript to v7; Node engine floor raised to `>=22.18.0`.
- Hardened the Express reference adapter: CORS defaults to the comma-separated
  `CORS_ORIGINS` allow-list (localhost fallback), `x-powered-by` is disabled
  and JSON/urlencoded bodies are capped at 100 kb.

### Fixed

- **Pure ESM `.js` exports** — all relative imports in `src/` now use explicit
  `.js` extensions (`module: nodenext`), so Node's ESM loader and bundlers
  resolve the emitted `dist/` correctly.
- **`WorkerService` pool correlation** — `useRunPool` now correlates responses
  by echoing a `taskId` from the worker blob, fixing concurrent race
  conditions.
- **`useEncrypt` salt** — generates a random 128-bit salt when none is provided
  instead of relying on a fixed default.
- **SEO JSON-LD escaping** — `<`, `>` and `&` are escaped inside the
  `application/ld+json` script to prevent `</script>` breakout.

## [2.0.0] - 2026-09-03

Developed and published as `katanakit-dev`.

### Changed

- **Reorganized the project with hexagonal architecture** into `types/`,
  `core/services/` (ports + pure services), `infrastructure/` (browser/runtime
  adapters), `adapters/` (Astro + Express) and `prisma/`, replacing the previous
  flat `helpers/`/`api/` layout.
- Exposed the public API through barrel files (`src/index.ts` and per-layer
  `index.ts`).

### Added

- Added `biome.json` and `vitest.config.ts`; wired `typecheck`, `build`, `test`,
  `lint`, `format` and `check` scripts.
- Added Vitest unit tests for the HTTP client, logger, storage, geometry, errors
  and reactive signals.
- Added English documentation (`README.md`, `CONTRIBUTING.md`, `docs/`,
  `SECURITY.md`).

### Fixed

- Fixed TypeScript compile errors: broken imports, broken singleton guards
  (`TimingService` and `ViewportService`), the `FIND_ENTRY` scope bug in
  `AstroService`, and Express `Request`/`Response` typing.
- Removed all side effects on import (top-level `fetch` to dummyjson.com,
  `console.log` calls, storage writes and timers).
- Fixed the Express server: `listen` now uses the configured port/host, the user
  router is mounted, and handler `(req, res)` argument order is correct.
- Fixed the logger call sites (level is now the first argument of `useLog`).

### Removed

- Removed duplicate type definitions (unified in `src/types/`), dead code, empty
  files and the broken signals draft.
- Moved demos to `examples/` and dropped the obsolete `wiki/` documentation.
