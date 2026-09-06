# katanakit-js

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

```html
<script type="module">
  import { useGetApi, useInitApis } from "https://cdn.jsdelivr.net/npm/katanakit-js@latest/dist/index.js";
</script>
```

| CDN | URL |
|-----|-----|
| **jsDelivr** | `https://cdn.jsdelivr.net/npm/katanakit-js@latest/dist/index.js` |
| **unpkg** | `https://unpkg.com/katanakit-js@latest/dist/index.js` |

## Quick Start

```ts
import { useInitApis, useGetApi } from "katanakit-js";

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
