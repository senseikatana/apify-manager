---
title: Changelog
sidebar_position: 4
description: Release history for KatanaKit JS
---

# Changelog

All notable changes to this project are documented in this page.

## Release 2.2.1

**Unreleased**

### New Features

- **Vue adapter** — new `katanakit-js/adapters/vue` subpath exporting the `useKatanaFetch` composable, which bridges KatanaKit Safe Results to Vue 3 reactivity (`data`, `error`, `loading`, `refetch`). Accepts a reactive `Ref` of `UrlOptions` and refetches automatically on change. `vue` is an optional peer dependency.
- **Nuxt adapter** — new `katanakit-js/adapters/nuxt` subpath exporting three pure helpers that bridge KatanaKit's Safe Results to Nuxt/Nitro server routes: `useUnwrap`, `useSafeResponse`, `useEventResponse`. They avoid a hard dependency on `h3` (which ships with Nuxt).
- **Site config and SEO module** — new `src/config/` layer with `siteConfig`/`SiteConfig` and pure SEO helpers (`useGenerateMetaTags`, `useTitle`, `useRssHeadLink`), re-exported from the main barrel. Includes HTML/attribute escaping and JSON-LD breakout protection.
- **`publish:*` scripts** — `publish:patch`, `publish:minor`, `publish:major` (tagged `beta`) with a `prepublishOnly` gate that runs Biome, tests and the build before publishing.
- New Vitest suites for RSS, Nuxt, SEO and Vue services (60 tests across 8 files).

### Bug Fixes

- **Pure ESM `.js` exports** — all relative imports in `src/` now use explicit `.js` extensions (`module: nodenext`), so Node's ESM loader and bundlers resolve the package cleanly.
- **`WorkerService` pool correlation** — `useRunPool` now correlates responses by echoing a `taskId` from the worker blob, fixing concurrent race conditions.
- **`useEncrypt` salt** — generates a random 128-bit salt when none is provided instead of relying on a fixed default.
- **SEO JSON-LD escaping** — `<`, `>`, and `&` are escaped inside the `application/ld+json` script to prevent `</script>` breakout.

---

## Release 2.0.0

**2026-09-03**

Developed and published as `katanakit-dev`.

### New Features

- **Reorganized the project** with hexagonal architecture into `types/`, `core/services/`, `infrastructure/`, `adapters/`, `config/`, and `prisma/`.
- Exposed the public API through barrel files (`src/index.ts` and per-layer `index.ts`).
- Added Vitest unit tests for the HTTP client, logger, storage, DOM, and reactive services.
- Added English documentation (`README.md`, `CONTRIBUTING.md`, `docs/`, `SECURITY.md`).

### Bug Fixes

- Fixed TypeScript compile errors: broken imports, broken singleton guards (`TimingService` and `ViewportService`), the `FIND_ENTRY` scope bug in `AstroService`, and Express `Request`/`Response` typing.
- Removed all side effects on import (top-level `fetch` to dummyjson.com, `console.log` calls, storage writes and timers).
- Fixed the Express server: `listen` now uses the configured port/host, the user router is mounted, and handler `(req, res)` argument order is correct.
- Fixed the logger call sites (level is now the first argument of `useLog`).

---

## Release 1.x

**Earlier**

Initial release series focusing on core KatanaKit functionality and framework adapters.

---

## Release 0.1.0

**Initial release**

First public release of KatanaKit.
