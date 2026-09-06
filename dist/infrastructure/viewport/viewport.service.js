/**
 * Viewport, scroll and window utilities. All methods are SSR-safe.
 */
export default class ViewportService {
    static instance;
    tempTitleTimer;
    tempTitleOriginal;
    constructor() { }
    static getInstance() {
        if (!ViewportService.instance) {
            ViewportService.instance = new ViewportService();
        }
        return ViewportService.instance;
    }
    isBrowser = () => typeof window !== "undefined" && typeof document !== "undefined";
    useGetViewportSize = () => {
        if (!this.isBrowser())
            return { width: 0, height: 0 };
        return { width: window.innerWidth, height: window.innerHeight };
    };
    useMatchesMedia = (query) => {
        if (!this.isBrowser() || !window.matchMedia)
            return false;
        return window.matchMedia(query).matches;
    };
    usePrefersReducedMotion = () => this.useMatchesMedia("(prefers-reduced-motion: reduce)");
    usePrefersDarkMode = () => this.useMatchesMedia("(prefers-color-scheme: dark)");
    useGetScrollY = () => (this.isBrowser() ? window.scrollY : 0);
    useGetScrollX = () => (this.isBrowser() ? window.scrollX : 0);
    useGetScrollPosition = () => ({
        x: this.useGetScrollX(),
        y: this.useGetScrollY(),
    });
    useGetScrollProgress = () => {
        if (!this.isBrowser())
            return 0;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight <= 0)
            return 0;
        return Math.min(1, Math.max(0, window.scrollY / scrollHeight));
    };
    useIsAtTop = (threshold = 0) => this.useGetScrollY() <= threshold;
    useIsAtBottom = (threshold = 50) => {
        if (!this.isBrowser())
            return false;
        const scrollHeight = document.documentElement.scrollHeight;
        return window.scrollY + window.innerHeight >= scrollHeight - threshold;
    };
    useScrollTo = (x = 0, y = 0, behavior = "smooth") => {
        if (!this.isBrowser())
            return;
        const finalBehavior = this.usePrefersReducedMotion() ? "auto" : behavior;
        window.scrollTo({ top: y, left: x, behavior: finalBehavior });
    };
    useScrollToTop = (smooth = true) => {
        if (!this.isBrowser())
            return;
        const behavior = smooth && !this.usePrefersReducedMotion() ? "smooth" : "auto";
        window.scrollTo({ top: 0, behavior });
    };
    useScrollToBottom = (smooth = true) => {
        if (!this.isBrowser())
            return;
        const behavior = smooth && !this.usePrefersReducedMotion() ? "smooth" : "auto";
        const scrollHeight = document.documentElement.scrollHeight;
        window.scrollTo({ top: scrollHeight, behavior });
    };
    useScrollToElement = (target, options = {}) => {
        if (!this.isBrowser())
            return false;
        const element = typeof target === "string" ? document.querySelector(target) : target;
        if (!element)
            return false;
        const behavior = this.usePrefersReducedMotion()
            ? "auto"
            : (options.behavior ?? "smooth");
        element.scrollIntoView({
            behavior,
            block: options.block ?? "start",
            inline: options.inline ?? "nearest",
        });
        return true;
    };
    usePrintPage = () => {
        if (this.isBrowser())
            window.print();
    };
    useFocusElement = (target) => {
        if (!this.isBrowser())
            return false;
        const element = typeof target === "string" ? document.querySelector(target) : target;
        if (!element)
            return false;
        element.focus();
        return true;
    };
    useBlurActiveElement = () => {
        if (!this.isBrowser())
            return;
        document.activeElement?.blur();
    };
    useGetActiveElement = () => this.isBrowser() ? document.activeElement : null;
    useRequestFullscreen = async (target) => {
        if (!this.isBrowser() || !document.fullscreenEnabled) {
            throw new Error("Fullscreen not supported");
        }
        const element = target ?? document.documentElement;
        await element.requestFullscreen();
    };
    useExitFullscreen = async () => {
        if (!this.isBrowser() || !document.fullscreenElement)
            return;
        await document.exitFullscreen();
    };
    useIsFullscreen = () => this.isBrowser() && !!document.fullscreenElement;
    useIsDocumentVisible = () => {
        if (!this.isBrowser())
            return true;
        return document.visibilityState === "visible";
    };
    useOnVisibilityChange = (callback) => {
        if (!this.isBrowser())
            return () => { };
        const handler = () => callback(this.useIsDocumentVisible());
        document.addEventListener("visibilitychange", handler);
        return () => document.removeEventListener("visibilitychange", handler);
    };
    useGetTitle = () => (this.isBrowser() ? document.title : "");
    useSetTitle = (title) => {
        if (this.isBrowser())
            document.title = title;
    };
    useSetTempTitle = (tempTitle, durationMs = 3000) => {
        if (!this.isBrowser())
            return;
        if (this.tempTitleTimer !== undefined) {
            clearTimeout(this.tempTitleTimer);
            this.tempTitleTimer = undefined;
        }
        if (this.tempTitleOriginal === undefined) {
            this.tempTitleOriginal = document.title;
        }
        document.title = tempTitle;
        this.tempTitleTimer = setTimeout(() => {
            if (document.title === tempTitle && this.tempTitleOriginal !== undefined) {
                document.title = this.tempTitleOriginal;
            }
            this.tempTitleOriginal = undefined;
            this.tempTitleTimer = undefined;
        }, durationMs);
    };
}
// Singleton instance and destructured exports.
export const { useGetViewportSize, useMatchesMedia, usePrefersReducedMotion, usePrefersDarkMode, useGetScrollY, useGetScrollX, useGetScrollPosition, useGetScrollProgress, useIsAtTop, useIsAtBottom, useScrollTo, useScrollToTop, useScrollToBottom, useScrollToElement, usePrintPage, useFocusElement, useBlurActiveElement, useGetActiveElement, useRequestFullscreen, useExitFullscreen, useIsFullscreen, useIsDocumentVisible, useOnVisibilityChange, useGetTitle, useSetTitle, useSetTempTitle, } = ViewportService.getInstance();
//# sourceMappingURL=viewport.service.js.map