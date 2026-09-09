import type { ObserverCallback, ObserverTarget } from "../../types/index.js";
/**
 * Checks whether `IntersectionObserver` is available in the current environment.
 *
 * @returns `true` if `IntersectionObserver` is supported.
 *
 * @example
 * ```ts
 * if (useIsSupported()) {
 *   // safe to use observer APIs
 * }
 * ```
 */
export declare function useIsSupported(): boolean;
/**
 * Creates an IntersectionObserver under the given key.
 * If an observer with the same key already exists, it is disconnected first.
 *
 * @param key - A unique identifier for this observer.
 * @param callback - Invoked when an observed element enters the viewport.
 * @param options - IntersectionObserver options (default: `{ threshold: 0.1 }`).
 * @param autoUnobserve - Whether to automatically unobserve after first intersection (default: `true`).
 *
 * @example
 * ```ts
 * useObserverCreate("hero", (entry) => {
 *   console.log("Hero is visible!", entry.target);
 * }, { threshold: 0.5 });
 * ```
 */
export declare function useObserverCreate(key: string, callback: ObserverCallback, options?: IntersectionObserverInit, autoUnobserve?: boolean): void;
/**
 * Starts observing a single element under an existing observer key.
 *
 * @param key - The observer key created via {@link useObserverCreate}.
 * @param element - A CSS selector string or an HTMLElement to observe.
 *
 * @example
 * ```ts
 * useObserverObserve("hero", "#hero-image");
 * ```
 */
export declare function useObserverObserve(key: string, element: ObserverTarget): void;
/**
 * Observes all elements matching a CSS selector under an existing observer key.
 *
 * @param key - The observer key created via {@link useObserverCreate}.
 * @param selector - A CSS selector string matching all elements to observe.
 *
 * @example
 * ```ts
 * useObserverObserveAll("images", "img.lazy");
 * ```
 */
export declare function useObserverObserveAll(key: string, selector: string): void;
/**
 * Stops observing a specific element under an observer key.
 *
 * @param key - The observer key.
 * @param element - The HTMLElement to stop observing.
 */
export declare function useObserverUnobserve(key: string, element: HTMLElement): void;
/**
 * Disconnects and removes an observer by key, cleaning up all observed targets.
 *
 * @param key - The observer key to disconnect.
 *
 * @example
 * ```ts
 * useObserverDisconnect("hero");
 * ```
 */
export declare function useObserverDisconnect(key: string): void;
/**
 * Disconnects and removes all registered observers.
 *
 * @example
 * ```ts
 * useObserverDisconnectAll(); // clean up everything
 * ```
 */
export declare function useObserverDisconnectAll(): void;
/**
 * Checks whether an observer with the given key exists.
 *
 * @param key - The observer key to check.
 * @returns `true` if an observer is registered under the key.
 */
export declare function useObserverHas(key: string): boolean;
/**
 * Returns a list of all registered observer keys.
 *
 * @returns An array of observer key strings.
 */
export declare function useObserverKeys(): string[];
/**
 * Initializes lazy loading for images using IntersectionObserver.
 * Elements matching the selector must have a `data-src` attribute with the real image URL.
 *
 * @param key - A unique identifier for this lazy-loader instance (default: `"default"`).
 * @param selector - CSS selector for lazy-loadable images (default: `"img[data-src]"`).
 * @param rootMargin - IntersectionObserver root margin (default: `"200px"`).
 *
 * @example
 * ```ts
 * useLazyLoaderInit("gallery", "img[data-src]", "300px");
 * ```
 */
export declare function useLazyLoaderInit(key?: string, selector?: string, rootMargin?: string): void;
/**
 * Stops a lazy-loader instance and disconnects its underlying observer.
 *
 * @param key - The lazy-loader key to stop.
 */
export declare function useLazyLoaderStop(key: string): void;
/**
 * Stops all active lazy-loader instances.
 */
export declare function useLazyLoaderStopAll(): void;
/**
 * Checks whether a lazy-loader with the given key is active.
 *
 * @param key - The lazy-loader key to check.
 * @returns `true` if the lazy-loader is registered.
 */
export declare function useLazyLoaderHas(key: string): boolean;
//# sourceMappingURL=observer.service.d.ts.map