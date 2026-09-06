# `katanakit-js`

A sharp, framework-agnostic TypeScript service toolkit organized with hexagonal architecture.

## Installation

```bash
npm install katanakit-js
# or
bun add katanakit-js
# or
yarn add katanakit-js
```

### CDN (ESM)

In the browser, use jsDelivr **`/+esm`** so named exports and dependencies resolve:

```html
<script type="module">
  import { useLogger, useGetApi, useInitApis } from "https://cdn.jsdelivr.net/npm/katanakit-js/+esm";
  useLogger("ready");
</script>
```

| CDN | URL |
|-----|-----|
| **jsDelivr `/+esm`** (recommended) | `https://cdn.jsdelivr.net/npm/katanakit-js/+esm` |
| **esm.sh** | `https://esm.sh/katanakit-js` |
| **Raw ESM file** | `https://cdn.jsdelivr.net/npm/katanakit-js/dist/index.js` (needs bundler or import map) |

Pin a version in production (e.g. `@2.8.0/+esm`). There is no IIFE/UMD build.

## Quick Start

```ts
import { useInitApis, useGetApi, useLogger } from "katanakit-js";

useLogger("boot");

// Register your APIs once
useInitApis({
  pokeapi: {
    baseUri: "https://pokeapi.co/api/v2",
    endpoints: { pokemonById: "/pokemon/:id/" },
  },
});

// Fetch with Safe Result — no try/catch needed for HTTP failures
const result = await useGetApi<{ name: string }>("pokeapi", "pokemonById", {
  params: { id: 25 },
});

if (result.ok) {
  console.log(result.data.name); // "pikachu"
} else {
  console.error(result.error.message);
}
```

## Features

- **Safe Results** — HTTP (and other fallible) operations return `{ data, error, ok }` instead of throwing
- **Zero side effects** — importing any module is safe. No `fetch` calls, no `console.log`, no storage writes
- **Hexagonal architecture** — pure core, infrastructure adapters, framework adapters
- **Tree-shakeable** — destructured re-exports from Singleton facades
- **SSR-safe** — all infrastructure adapters guard or fall back gracefully in server environments

## Framework usage

All common `use*` helpers (`useLogger`, `useInitApis`, `useGetApi`, formatter, dates, utils, theme, …) are on the **main barrel** `katanakit-js`.

### Astro (npm)

```astro
---
// Frontmatter = server
import { useLogger, useGetApi, useInitApis } from "katanakit-js";
useInitApis({ /* ... */ });
const result = await useGetApi("pokeapi", "pokemonById", { params: { id: 25 } });
---
<script>
  // Client script — Vite bundles the same package
  import { useLogger } from "katanakit-js";
  useLogger("client");
</script>
```

### Astro (CDN client)

```astro
<script is:inline type="module">
  import { useLogger } from "https://cdn.jsdelivr.net/npm/katanakit-js/+esm";
  useLogger("cdn");
</script>
```

### Vue / Nuxt / vanilla

```ts
import { useLogger, useInitApis, useGetApi } from "katanakit-js";
import { useKatanaFetch } from "katanakit-js/adapters/vue";   // Vue only
import { useUnwrap } from "katanakit-js/adapters/nuxt";         // Nuxt only
```

```html
<!-- vanilla -->
<script type="module">
  import { useLogger } from "https://cdn.jsdelivr.net/npm/katanakit-js/+esm";
</script>
```

See [Getting Started](https://senseikatana.github.io/katanakit-js/docs/guides/getting-started) for full recipes.

## Framework Adapters

| Adapter | Import | Description |
|---------|--------|-------------|
| **Express** | `katanakit-js/adapters/express` | Reference server with CORS and hardened headers |
| **Nuxt** | `katanakit-js/adapters/nuxt` | `useUnwrap`, `useSafeResponse`, `useEventResponse` |
| **Vue** | `katanakit-js/adapters/vue` | `useKatanaFetch` composable with reactivity |
| **Astro** | `katanakit-js` or `katanakit-js/adapters/astro` | `AstroService`, `RssService` |

## Documentation

- [Getting Started](https://senseikatana.github.io/katanakit-js/docs/guides/getting-started)
- [Architecture](https://senseikatana.github.io/katanakit-js/docs/guides/architecture)
- [API Reference](https://senseikatana.github.io/katanakit-js/docs/api)
- [Roadmap](https://senseikatana.github.io/katanakit-js/docs/guides/roadmap)
- [Changelog](https://senseikatana.github.io/katanakit-js/docs/changelog)

## License

MIT
