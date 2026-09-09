import type { ScrollOptions, ScrollPosition, ViewportSize } from "../../types/index.js";
/**
 * Returns the current viewport dimensions.
 *
 * @returns A {@link ViewportSize} object with `width` and `height` (or `{0, 0}` in SSR).
 *
 * @example
 * ```ts
 * const { width, height } = useGetViewportSize();
 * if (width < 768) { /* mobile *​/ }
 * ```
 */
export declare const useGetViewportSize: () => ViewportSize;
/**
 * Tests a CSS media query against the current viewport.
 *
 * @param query - A CSS media query string (e.g. `"(min-width: 768px)"`).
 * @returns `true` if the query matches.
 *
 * @example
 * ```ts
 * if (useMatchesMedia("(prefers-reduced-motion: reduce)")) {
 *   // disable animations
 * }
 * ```
 */
export declare const useMatchesMedia: (query: string) => boolean;
/**
 * Checks whether the user prefers reduced motion.
 *
 * @returns `true` if `prefers-reduced-motion: reduce` is active.
 *
 * @example
 * ```ts
 * const smooth = !usePrefersReducedMotion();
 * ```
 */
export declare const usePrefersReducedMotion: () => boolean;
/**
 * Checks whether the user's OS prefers dark mode.
 *
 * @returns `true` if `prefers-color-scheme: dark` is active.
 */
export declare const usePrefersDarkMode: () => boolean;
/**
 * Returns the current vertical scroll position.
 *
 * @returns `window.scrollY` or `0` in SSR.
 */
export declare const useGetScrollY: () => number;
/**
 * Returns the current horizontal scroll position.
 *
 * @returns `window.scrollX` or `0` in SSR.
 */
export declare const useGetScrollX: () => number;
/**
 * Returns the current scroll position as `{ x, y }`.
 *
 * @returns A {@link ScrollPosition} object.
 *
 * @example
 * ```ts
 * const { x, y } = useGetScrollPosition();
 * ```
 */
export declare const useGetScrollPosition: () => ScrollPosition;
/**
 * Returns the vertical scroll progress as a value between `0` (top) and `1` (bottom).
 *
 * @returns A number in `[0, 1]`.
 *
 * @example
 * ```ts
 * const progress = useGetScrollProgress();
 * progressBar.style.width = `${progress * 100}%`;
 * ```
 */
export declare const useGetScrollProgress: () => number;
/**
 * Checks whether the page is scrolled to (or near) the top.
 *
 * @param threshold - Pixel tolerance (default: `0`).
 * @returns `true` if `scrollY <= threshold`.
 */
export declare const useIsAtTop: (threshold?: number) => boolean;
/**
 * Checks whether the page is scrolled to (or near) the bottom.
 *
 * @param threshold - Pixel tolerance from the bottom (default: `50`).
 * @returns `true` if within `threshold` pixels of the bottom.
 */
export declare const useIsAtBottom: (threshold?: number) => boolean;
/**
 * Scrolls the window to a specific position, respecting `prefers-reduced-motion`.
 *
 * @param x - Horizontal scroll target (default: `0`).
 * @param y - Vertical scroll target (default: `0`).
 * @param behavior - Scroll behavior (default: `"smooth"`).
 *
 * @example
 * ```ts
 * useScrollTo(0, 500); // scroll to 500px from top
 * ```
 */
export declare const useScrollTo: (x?: number, y?: number, behavior?: ScrollBehavior) => void;
/**
 * Scrolls to the top of the page.
 *
 * @param smooth - Whether to use smooth scrolling (default: `true`).
 */
export declare const useScrollToTop: (smooth?: boolean) => void;
/**
 * Scrolls to the bottom of the page.
 *
 * @param smooth - Whether to use smooth scrolling (default: `true`).
 */
export declare const useScrollToBottom: (smooth?: boolean) => void;
/**
 * Scrolls an element into view.
 *
 * @param target - An HTMLElement or a CSS selector string.
 * @param options - Scroll options (`behavior`, `block`, `inline`).
 * @returns `true` if the element was found and scrolled to.
 *
 * @example
 * ```ts
 * useScrollToElement("#section-2", { behavior: "smooth", block: "start" });
 * ```
 */
export declare const useScrollToElement: (target: HTMLElement | string, options?: ScrollOptions) => boolean;
/**
 * Triggers the browser print dialog.
 *
 * @example
 * ```ts
 * usePrintPage();
 * ```
 */
export declare const usePrintPage: () => void;
/**
 * Focuses an element.
 *
 * @param target - An HTMLElement or a CSS selector string.
 * @returns `true` if the element was found and focused.
 *
 * @example
 * ```ts
 * useFocusElement("#search-input");
 * ```
 */
export declare const useFocusElement: (target: HTMLElement | string) => boolean;
/**
 * Removes focus from the currently active element.
 */
export declare const useBlurActiveElement: () => void;
/**
 * Returns the currently focused element.
 *
 * @returns The active element, or `null` in SSR.
 */
export declare const useGetActiveElement: () => Element | null;
/**
 * Requests fullscreen on the given element (or the document root).
 *
 * @param target - The element to make fullscreen (defaults to `document.documentElement`).
 * @throws {Error} If fullscreen is not supported.
 *
 * @example
 * ```ts
 * await useRequestFullscreen(videoElement);
 * ```
 */
export declare const useRequestFullscreen: (target?: HTMLElement) => Promise<void>;
/**
 * Exits fullscreen mode.
 */
export declare const useExitFullscreen: () => Promise<void>;
/**
 * Checks whether the document is currently in fullscreen mode.
 *
 * @returns `true` if fullscreen is active.
 */
export declare const useIsFullscreen: () => boolean;
/**
 * Checks whether the document tab is currently visible.
 *
 * @returns `true` if `document.visibilityState === "visible"`.
 */
export declare const useIsDocumentVisible: () => boolean;
/**
 * Registers a callback for document visibility changes.
 *
 * @param callback - Called with `true` when visible, `false` when hidden.
 * @returns A cleanup function that removes the listener.
 *
 * @example
 * ```ts
 * const off = useOnVisibilityChange((visible) => {
 *   if (visible) resumePolling();
 *   else pausePolling();
 * });
 * ```
 */
export declare const useOnVisibilityChange: (callback: (isVisible: boolean) => void) => (() => void);
/**
 * Returns the current document title.
 *
 * @returns The title string, or `""` in SSR.
 */
export declare const useGetTitle: () => string;
/**
 * Sets the document title.
 *
 * @param title - The new title.
 *
 * @example
 * ```ts
 * useSetTitle("My Page");
 * ```
 */
export declare const useSetTitle: (title: string) => void;
/**
 * Temporarily changes the document title, restoring the original after `durationMs`.
 *
 * @param tempTitle - The temporary title to display.
 * @param durationMs - How long to show it (default: `3000`).
 *
 * @example
 * ```ts
 * useSetTempTitle("(2) New messages!", 5000);
 * // title reverts after 5 seconds
 * ```
 */
export declare const useSetTempTitle: (tempTitle: string, durationMs?: number) => void;
//# sourceMappingURL=viewport.service.d.ts.map