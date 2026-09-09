// ============================================================
// Internal helpers
// ============================================================
/**
 * Checks whether the code is running in a browser environment.
 *
 * @returns `true` if both `window` and `document` are defined.
 */
function isBrowser() {
    return typeof window !== "undefined" && typeof document !== "undefined";
}
// ============================================================
// Module-level state (temporary title)
// ============================================================
let tempTitleTimer;
let tempTitleOriginal;
// ============================================================
// Public API
// ============================================================
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
export const useGetViewportSize = () => {
    if (!isBrowser())
        return { width: 0, height: 0 };
    return { width: window.innerWidth, height: window.innerHeight };
};
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
export const useMatchesMedia = (query) => {
    if (!isBrowser() || !window.matchMedia)
        return false;
    return window.matchMedia(query).matches;
};
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
export const usePrefersReducedMotion = () => useMatchesMedia("(prefers-reduced-motion: reduce)");
/**
 * Checks whether the user's OS prefers dark mode.
 *
 * @returns `true` if `prefers-color-scheme: dark` is active.
 */
export const usePrefersDarkMode = () => useMatchesMedia("(prefers-color-scheme: dark)");
/**
 * Returns the current vertical scroll position.
 *
 * @returns `window.scrollY` or `0` in SSR.
 */
export const useGetScrollY = () => (isBrowser() ? window.scrollY : 0);
/**
 * Returns the current horizontal scroll position.
 *
 * @returns `window.scrollX` or `0` in SSR.
 */
export const useGetScrollX = () => (isBrowser() ? window.scrollX : 0);
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
export const useGetScrollPosition = () => ({
    x: useGetScrollX(),
    y: useGetScrollY(),
});
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
export const useGetScrollProgress = () => {
    if (!isBrowser())
        return 0;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0)
        return 0;
    return Math.min(1, Math.max(0, window.scrollY / scrollHeight));
};
/**
 * Checks whether the page is scrolled to (or near) the top.
 *
 * @param threshold - Pixel tolerance (default: `0`).
 * @returns `true` if `scrollY <= threshold`.
 */
export const useIsAtTop = (threshold = 0) => useGetScrollY() <= threshold;
/**
 * Checks whether the page is scrolled to (or near) the bottom.
 *
 * @param threshold - Pixel tolerance from the bottom (default: `50`).
 * @returns `true` if within `threshold` pixels of the bottom.
 */
export const useIsAtBottom = (threshold = 50) => {
    if (!isBrowser())
        return false;
    const scrollHeight = document.documentElement.scrollHeight;
    return window.scrollY + window.innerHeight >= scrollHeight - threshold;
};
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
export const useScrollTo = (x = 0, y = 0, behavior = "smooth") => {
    if (!isBrowser())
        return;
    const finalBehavior = usePrefersReducedMotion() ? "auto" : behavior;
    window.scrollTo({ top: y, left: x, behavior: finalBehavior });
};
/**
 * Scrolls to the top of the page.
 *
 * @param smooth - Whether to use smooth scrolling (default: `true`).
 */
export const useScrollToTop = (smooth = true) => {
    if (!isBrowser())
        return;
    const behavior = smooth && !usePrefersReducedMotion() ? "smooth" : "auto";
    window.scrollTo({ top: 0, behavior });
};
/**
 * Scrolls to the bottom of the page.
 *
 * @param smooth - Whether to use smooth scrolling (default: `true`).
 */
export const useScrollToBottom = (smooth = true) => {
    if (!isBrowser())
        return;
    const behavior = smooth && !usePrefersReducedMotion() ? "smooth" : "auto";
    const scrollHeight = document.documentElement.scrollHeight;
    window.scrollTo({ top: scrollHeight, behavior });
};
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
export const useScrollToElement = (target, options = {}) => {
    if (!isBrowser())
        return false;
    const element = typeof target === "string" ? document.querySelector(target) : target;
    if (!element)
        return false;
    const behavior = usePrefersReducedMotion()
        ? "auto"
        : (options.behavior ?? "smooth");
    element.scrollIntoView({
        behavior,
        block: options.block ?? "start",
        inline: options.inline ?? "nearest",
    });
    return true;
};
/**
 * Triggers the browser print dialog.
 *
 * @example
 * ```ts
 * usePrintPage();
 * ```
 */
export const usePrintPage = () => {
    if (isBrowser())
        window.print();
};
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
export const useFocusElement = (target) => {
    if (!isBrowser())
        return false;
    const element = typeof target === "string" ? document.querySelector(target) : target;
    if (!element)
        return false;
    element.focus();
    return true;
};
/**
 * Removes focus from the currently active element.
 */
export const useBlurActiveElement = () => {
    if (!isBrowser())
        return;
    document.activeElement?.blur();
};
/**
 * Returns the currently focused element.
 *
 * @returns The active element, or `null` in SSR.
 */
export const useGetActiveElement = () => isBrowser() ? document.activeElement : null;
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
export const useRequestFullscreen = async (target) => {
    if (!isBrowser() || !document.fullscreenEnabled) {
        throw new Error("Fullscreen not supported");
    }
    const element = target ?? document.documentElement;
    await element.requestFullscreen();
};
/**
 * Exits fullscreen mode.
 */
export const useExitFullscreen = async () => {
    if (!isBrowser() || !document.fullscreenElement)
        return;
    await document.exitFullscreen();
};
/**
 * Checks whether the document is currently in fullscreen mode.
 *
 * @returns `true` if fullscreen is active.
 */
export const useIsFullscreen = () => isBrowser() && !!document.fullscreenElement;
/**
 * Checks whether the document tab is currently visible.
 *
 * @returns `true` if `document.visibilityState === "visible"`.
 */
export const useIsDocumentVisible = () => {
    if (!isBrowser())
        return true;
    return document.visibilityState === "visible";
};
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
export const useOnVisibilityChange = (callback) => {
    if (!isBrowser())
        return () => { };
    const handler = () => callback(useIsDocumentVisible());
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
};
/**
 * Returns the current document title.
 *
 * @returns The title string, or `""` in SSR.
 */
export const useGetTitle = () => (isBrowser() ? document.title : "");
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
export const useSetTitle = (title) => {
    if (isBrowser())
        document.title = title;
};
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
export const useSetTempTitle = (tempTitle, durationMs = 3000) => {
    if (!isBrowser())
        return;
    if (tempTitleTimer !== undefined) {
        clearTimeout(tempTitleTimer);
        tempTitleTimer = undefined;
    }
    if (tempTitleOriginal === undefined) {
        tempTitleOriginal = document.title;
    }
    document.title = tempTitle;
    tempTitleTimer = setTimeout(() => {
        if (document.title === tempTitle && tempTitleOriginal !== undefined) {
            document.title = tempTitleOriginal;
        }
        tempTitleOriginal = undefined;
        tempTitleTimer = undefined;
    }, durationMs);
};
//# sourceMappingURL=viewport.service.js.map