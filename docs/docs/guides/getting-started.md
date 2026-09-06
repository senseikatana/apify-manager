---
title: Getting Started
sidebar_position: 1
description: Install KatanaKit and learn every service with real code examples.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This guide covers every service in `katanakit-js` with runnable examples.
Each section shows the API, a real-world usage, and the Safe Result pattern.

## Installation

```bash
npm install katanakit-js
# or
bun add katanakit-js
```

Only `@js-temporal/polyfill` is a runtime dependency. `express`, `cors`,
`dotenv` and `@prisma/orm-postgres` are optional peer dependencies.

### CDN (ESM)

You can also load KatanaKit directly from a CDN without a bundler:

```html
<script type="module">
  import { useGetApi, useInitApis } from "https://cdn.jsdelivr.net/npm/katanakit-js@latest/dist/index.js";
</script>
```

| CDN | URL |
|-----|-----|
| **jsDelivr** | `https://cdn.jsdelivr.net/npm/katanakit-js@latest/dist/index.js` |
| **unpkg** | `https://unpkg.com/katanakit-js@latest/dist/index.js` |

## Import entry points

```ts
// Main barrel — everything except framework-heavy adapters
import { useGetApi, useLog, useSetStorage } from "katanakit-js";

// Framework subpaths
import { useUnwrap } from "katanakit-js/adapters/nuxt";
import { useKatanaFetch } from "katanakit-js/adapters/vue";
import { ServerExpress } from "katanakit-js/adapters/express";
import { RssService } from "katanakit-js/adapters/astro";
```

---

## HTTP Client — `FetchApiManager`

The HTTP client registers your APIs once, then builds safe URLs and fetches
data with a discriminated union result.

### Register APIs

```ts
import { useInitApis } from "katanakit-js";
// Legacy alias: useInit (deprecated)

useInitApis({
  pokeapi: {
    baseUri: "https://pokeapi.co/api/v2",
    endpoints: {
      pokemonById: "/pokemon/:id/",
      pokemons: "/pokemon/",
    },
    defaultQueryParams: { pokemons: { limit: 20 } },
  },
  jsonplaceholder: {
    baseUri: "https://jsonplaceholder.typicode.com",
    endpoints: {
      posts: "/posts",
      postById: "/posts/:id",
    },
  },
});
```

### Build URLs

```ts
import { useBuildApiUrl } from "katanakit-js";
// Legacy alias: useBuildUrl (deprecated)

const url = useBuildApiUrl("pokeapi", "pokemonById", {
  params: { id: "pikachu" },
});
// => "https://pokeapi.co/api/v2/pokemon/pikachu/"
```

### GET with Safe Result

```ts
import { useGetApi } from "katanakit-js";
// Legacy alias: useGet (deprecated)

interface Pokemon {
  name: string;
  id: number;
  types: { type: { name: string } }[];
}

const result = await useGetApi<Pokemon>("pokeapi", "pokemonById", {
  params: { id: 25 },
});

if (result.ok) {
  console.log(result.data.name);   // "pikachu"
  console.log(result.data.types);  // [{ type: { name: "electric" } }]
} else {
  console.error(result.error.status, result.error.message);
}
```

### POST JSON

```ts
import { usePost } from "katanakit-js";

const result = await usePost("jsonplaceholder", "posts", {
  title: "Hello World",
  body: "My first post",
  userId: 1,
});

// result.ok === true, result.data has the created resource
```

### PUT and DELETE

```ts
import { usePut, useDelete } from "katanakit-js";

await usePut("jsonplaceholder", "postById", { title: "Updated" }, {
  params: { id: 1 },
});

await useDelete("jsonplaceholder", "postById", { params: { id: 1 } });
```

### The Safe Result type

Every fetch returns the same discriminated union:

```ts
type FetchResult<T> =
  | { data: T; error: null; url: string; status: number; ok: true }
  | { data: null; error: ApiError; url: string; status: number; ok: false };
```

This means you never need `try/catch` for HTTP errors. The `ok` field
discriminates the result, and TypeScript narrows the type automatically.

---

## Logger — `LoggerService`

```ts
import { useLog, useError, LoggerService, type LogStrategy } from "katanakit-js";

// Info level (default)
useLog("Application started");

// Named levels
useLog("warn", "Cache miss", { key: "user:42" });
useLog("error", "Database timeout", { query: "SELECT * FROM users" });
useError("Something went wrong"); // shorthand for error level

// Console table
useTable([{ name: "Pikachu", type: "Electric" }]);

// Swap output at runtime (Strategy pattern)
const telemetryStrategy: LogStrategy = {
  useOutput: (level, message, data) => {
    fetch("https://telemetry.example.com/log", {
      method: "POST",
      body: JSON.stringify({ level, message, data }),
    });
  },
};
LoggerService.getInstance().useSetStrategy(telemetryStrategy);
```

---

## Storage — `StorageService`

SSR-safe: when `window` is unavailable, an in-memory fallback is used.
Wrap request handlers with `useRunStorageScope` so values persist within a
request without leaking across SSR requests.

```ts
import {
  useSetStorage, useGetStorage, useRemoveStorage, useClearStorage, useRunStorageScope,
} from "katanakit-js";

useRunStorageScope(() => {
  useSetStorage("user", { name: "John", role: "admin" });
  useSetStorage("theme", "dark");

  const user = useGetStorage<{ name: string; role: string }>("user");
  const theme = useGetStorage<string>("theme"); // "dark"

  useRemoveStorage("theme");
  useClearStorage();
});
```

---

## DOM — `DomService`

All methods are SSR-safe: they return `null`, `[]` or `false` when `document`
is unavailable.

```ts
import {
  useQuerySelector, useQuerySelectorAll, useAddClass, useRemoveClass,
  useToggleClass, useOn, useSetText, useSetHtml, useGetRoot,
} from "katanakit-js";

// Query elements
const btn = useQuerySelector<HTMLButtonElement>("button.submit");
const items = useQuerySelectorAll<HTMLElement>(".list-item");

// Class manipulation
const root = useGetRoot();
useAddClass(root!, "dark-mode");
useRemoveClass(root!, "dark-mode");
const isActive = useToggleClass(btn!, "active");

// Events (returns unsubscribe function)
const unsubscribe = useOn(btn!, "click", (e) => {
  console.log("Button clicked!", e.target);
});
// Later: unsubscribe();

// Content
useSetText(btn!, "Click me");
useSetHtml(btn!, "<strong>Bold</strong>");
```

---

## Reactive — `ReactiveService`

Lightweight signals with automatic dependency tracking.

```ts
import {
  useCreateSignal, useCreateEffect, useCreateMemo,
  useCreateToggle, useCreateStorageSignal, useCreateDebouncedSignal,
} from "katanakit-js";

// Basic signal
const [count, setCount] = useCreateSignal(0);
console.log(count()); // 0
setCount(5);
console.log(count()); // 5

// Effect (runs when dependencies change — pass signal getters)
useCreateEffect(() => {
  console.log("Count changed:", count());
}, [count]);

// Memo (derived value)
const doubled = useCreateMemo(() => count() * 2, [count]);

// Toggle
const [isOpen, { useToggle }] = useCreateToggle(false);
useToggle(); // isOpen() === true

// Storage-persisted signal
const [theme, setTheme] = useCreateStorageSignal("theme", "light");

// Debounced signal
const [search, setSearch] = useCreateDebouncedSignal("", 300);
```

---

## Formatter — `FormatterService`

```ts
import {
  useFormatNumber, useFormatCurrency,
  useCapitalize, useUpperCase, useLowerCase, useJsonStringify,
} from "katanakit-js";

useFormatNumber(1234567.89, "de-DE");
useFormatCurrency({ amount: 99.99, currency: "USD", locale: "en-US" });

useCapitalize("hello world");   // "Hello world"
useUpperCase("hello");          // "HELLO"
useLowerCase("HELLO");          // "hello"
useJsonStringify({ a: 1 });
```

---

## Converter — `ConverterService`

Decorates `FormatterService` with unit conversions.

```ts
import {
  useToCelsius, useToFahrenheit, useToMiles, useToKilos,
  useToCm, useToInches,
} from "katanakit-js";

useToCelsius(212);       // "100.00"
useToFahrenheit(100);    // "212.00"
useToMiles(10);          // ~"6.21" (km → miles)
useToKilos(10);          // pounds → kilos
useToCm(1);              // inches → cm
useToInches(2.54);       // cm → inches
```

---

## ErrorFactory — `ErrorFactoryService`

```ts
import {
  useBadRequest, useUnauthorized, useForbidden,
  useNotFound, useInternal, useCustom,
  type AppError,
} from "katanakit-js";

const err: AppError = useNotFound("User not found");
// { status: 404, message: "User not found", ... }

useBadRequest("Invalid email");
useUnauthorized("Token expired");
useForbidden("Insufficient permissions");
useInternal("Database error");
useCustom("Validation failed", 422);
```

---

## Generator — `GeneratorService`

```ts
import { useUuid, useSlugify, useNumericId, useToken, useHash } from "katanakit-js";
// Legacy alias: useEncrypt → useHash (PBKDF2, not encryption)

useUuid();                  // "550e8400-e29b-41d4-a716-446655440000"
useSlugify("Hello World!"); // "hello-world"
useNumericId();             // incremental integer
useToken();                 // 6-digit number (100000–999999)
await useHash("secret");    // "salt:pbkdf2Hex" (async PBKDF2-SHA512)
```

---

## Dates — `DatesService`

Uses the Temporal API via `@js-temporal/polyfill`.

```ts
import {
  useNow, useFormat, useAddDays, useIsBefore, useDiff, useLastDayOfMonth,
} from "katanakit-js";

const now = useNow();                 // "2026-09-06" (ISO PlainDate string)
useFormat(now, "en", { dateStyle: "medium" });

const future = useAddDays(now, 30);   // ISO date string
useIsBefore(now, future);             // true
useDiff(now, future);                 // "0 years, 0 months and 30 days"
useLastDayOfMonth(now);               // last day of month as ISO string
```

---

## Geometry — `GeometryUtils`

```ts
import { GeometryUtils } from "katanakit-js";

GeometryUtils.area.useCircle(5);              // "78.54"
GeometryUtils.perimeter.useCircle(5);         // "31.42"
GeometryUtils.volume.useSphere(3);            // "113.10"
GeometryUtils.area.useRectangle(5, 10, { unit: "cm" }); // "50.00 cm"
```

---

## Timing — `TimingService`

```ts
import {
  useDelay, useSetTimeout, useInterval,
  useDebounce, useThrottle, useRepeat, useRace,
} from "katanakit-js";

await useDelay(1000);

const { promise, cancel } = useSetTimeout(() => "done", 5000);
cancel(); // rejects promise with "Timeout cancelled"

const { stop } = useInterval(() => console.log("tick"), 1000);
stop();

const debouncedSearch = useDebounce((...args: unknown[]) => {
  const query = String(args[0] ?? "");
  void fetch(`/api/search?q=${query}`);
}, 300);

const throttledScroll = useThrottle(() => {
  console.log("scroll position updated");
}, 100);

await useRepeat(async (i) => console.log("retry", i), 3, 1000);

// Race a promise against a timeout (ms)
const value = await useRace(fetch("/api").then((r) => r.json()), 5000);
```

---

## Viewport — `ViewportService`

```ts
import {
  useMatchesMedia, useScrollTo, useScrollToElement, usePrefersReducedMotion,
} from "katanakit-js";

useMatchesMedia("(min-width: 768px)");
useScrollTo(0, 0); // x, y
useScrollToElement("#section-2");
usePrefersReducedMotion();
```

---

## Observer — `ObserverService`

```ts
import { ObserverService } from "katanakit-js";

const observer = ObserverService.getInstance();

observer.useCreate("reveal", (entry) => {
  if (entry.isIntersecting) {
    console.log("Element is visible!", entry.target);
  }
}, { threshold: 0.5 });

observer.useObserve("reveal", document.querySelector(".card")!);
observer.useObserveAll("reveal", ".lazy-img");
observer.useDisconnect("reveal");
// or: observer.useDisconnectAll();
```

---

## Worker — `WorkerService`

```ts
import { WorkerService } from "katanakit-js";

const workers = WorkerService.getInstance();

// One-shot: pure function + input (runs off-thread when Worker is available)
const result = await workers.useRun((n: number) => n * 2, 21);
console.log(result); // 42

// Named pool
workers.useCreatePool("square", (n: number) => n ** 2);
const squared = await workers.useRunPool<number, number>("square", 9);
workers.useTerminate("square");
```

---

## Theme — `ThemeService`

```ts
import { ThemeService } from "katanakit-js";

const theme = ThemeService.getInstance();

theme.useInitTheme({ defaultMode: "dark" });
theme.useSetThemeMode("light");
theme.useToggleTheme();      // toggles between light/dark
theme.useResetTheme();        // resets to system preference
```

---

## Astro Adapter — `AstroService`

```ts
// src/pages/blog/[slug].astro
import { AstroService } from "katanakit-js";

export async function getStaticPaths() {
  const { useGetStaticPaths } = AstroService.getInstance();

  return useGetStaticPaths(getCollection, "blog", {
    param: "slug",
    valueFrom: (entry) => entry.slug ?? entry.id,
    propsFrom: (entry) => entry.data,
  });
}
```

Safe Result style — no error escapes the route module:

```ts
const result = await useGetStaticPaths(getCollection, "blog");
if (!result.ok) {
  console.error(result.error.message, result.error.collectionName);
}
```

---

## RSS — `RssService`

```ts
// src/pages/rss.xml.ts
import { RssService } from "katanakit-js";
import { getCollection } from "astro:content";

const { useCreateRssEndpoint } = RssService.getInstance();

export const GET = useCreateRssEndpoint({
  title: "My Blog",
  description: "Posts about TypeScript",
  site: "https://example.com",
  items: async () => {
    const posts = await getCollection("blog");
    return posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      link: `/blog/${post.slug}/`,
      description: post.data.description,
    }));
  },
});
```

---

## SEO — `useHeadTags`

```ts
import { type SiteConfig, useHeadTags, useGenerateMetaTags, useTitle } from "katanakit-js";

const siteConfig: SiteConfig = {
  site: "https://myblog.com",
  title: "My Blog",
  description: "A blog about TypeScript",
  lang: "en",
  author: "John Doe",
  ogImage: "/og-default.png",
  twitter: "johndoe",
  rss: { enabled: true, path: "/rss.xml", limit: 20 },
  seo: { noindex: false, canonical: true, openGraph: true, twitterCard: true, jsonLd: true },
};

// All <head> tags (title, meta, OG, Twitter Card, JSON-LD, RSS link)
const tags = useHeadTags(siteConfig, {
  title: "My Post",
  description: "A great post",
  url: "https://myblog.com/posts/my-post/",
  ogType: "article",
  publishedTime: "2026-01-15T00:00:00Z",
});
```

---

## Nuxt Adapter

```ts
import { useInit, useGet } from "katanakit-js";
import { useUnwrap, useSafeResponse, useEventResponse } from "katanakit-js/adapters/nuxt";

// server/plugins/api.ts
useInit({
  pokeapi: {
    baseUri: "https://pokeapi.co/api/v2",
    endpoints: { pokemonById: "/pokemon/:id/" },
  },
});

// server/api/pokemon/[id].ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const result = await useGet("pokeapi", "pokemonById", { params: { id } });
  return useUnwrap(result, `Pokemon ${id}`);
});
```

---

## Vue Adapter

```ts
import { useInit } from "katanakit-js";
import { useKatanaFetch } from "katanakit-js/adapters/vue";

useInit({
  pokeapi: {
    baseUri: "https://pokeapi.co/api/v2",
    endpoints: { pokemonById: "/pokemon/:id/" },
  },
});
```

```vue
<script setup lang="ts">
import { useKatanaFetch } from "katanakit-js/adapters/vue";

const { data, error, loading, refetch } = useKatanaFetch<{ name: string }>(
  "pokeapi", "pokemonById", { params: { id: 25 } }
);
</script>

<template>
  <div v-if="loading">Loading…</div>
  <div v-else-if="error">{{ error.message }}</div>
  <div v-else>
    <h1>{{ data?.name }}</h1>
    <button @click="refetch">Refresh</button>
  </div>
</template>
```

---

## Express Server

```ts
import { ServerExpress } from "katanakit-js/adapters/express";

ServerExpress.getInstance().useStart(); // http://localhost:3000
```

---

## Next steps

- [Architecture](/docs/guides/architecture) — understand the hexagonal layout
- [API Reference](/docs/api) — auto-generated from source
- [Changelog](/docs/changelog) — what changed in each version
- [Roadmap](/docs/guides/roadmap) — what's coming next
