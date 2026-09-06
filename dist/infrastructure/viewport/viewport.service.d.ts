import type { ScrollOptions, ScrollPosition, ViewportSize } from "../../types/index.js";
/**
 * Viewport, scroll and window utilities. All methods are SSR-safe.
 */
export default class ViewportService {
    private static instance;
    private tempTitleTimer;
    private tempTitleOriginal;
    private constructor();
    static getInstance(): ViewportService;
    private isBrowser;
    useGetViewportSize: () => ViewportSize;
    useMatchesMedia: (query: string) => boolean;
    usePrefersReducedMotion: () => boolean;
    usePrefersDarkMode: () => boolean;
    useGetScrollY: () => number;
    useGetScrollX: () => number;
    useGetScrollPosition: () => ScrollPosition;
    useGetScrollProgress: () => number;
    useIsAtTop: (threshold?: number) => boolean;
    useIsAtBottom: (threshold?: number) => boolean;
    useScrollTo: (x?: number, y?: number, behavior?: ScrollBehavior) => void;
    useScrollToTop: (smooth?: boolean) => void;
    useScrollToBottom: (smooth?: boolean) => void;
    useScrollToElement: (target: HTMLElement | string, options?: ScrollOptions) => boolean;
    usePrintPage: () => void;
    useFocusElement: (target: HTMLElement | string) => boolean;
    useBlurActiveElement: () => void;
    useGetActiveElement: () => Element | null;
    useRequestFullscreen: (target?: HTMLElement) => Promise<void>;
    useExitFullscreen: () => Promise<void>;
    useIsFullscreen: () => boolean;
    useIsDocumentVisible: () => boolean;
    useOnVisibilityChange: (callback: (isVisible: boolean) => void) => (() => void);
    useGetTitle: () => string;
    useSetTitle: (title: string) => void;
    useSetTempTitle: (tempTitle: string, durationMs?: number) => void;
}
export declare const useGetViewportSize: () => ViewportSize, useMatchesMedia: (query: string) => boolean, usePrefersReducedMotion: () => boolean, usePrefersDarkMode: () => boolean, useGetScrollY: () => number, useGetScrollX: () => number, useGetScrollPosition: () => ScrollPosition, useGetScrollProgress: () => number, useIsAtTop: (threshold?: number) => boolean, useIsAtBottom: (threshold?: number) => boolean, useScrollTo: (x?: number, y?: number, behavior?: ScrollBehavior) => void, useScrollToTop: (smooth?: boolean) => void, useScrollToBottom: (smooth?: boolean) => void, useScrollToElement: (target: HTMLElement | string, options?: ScrollOptions) => boolean, usePrintPage: () => void, useFocusElement: (target: HTMLElement | string) => boolean, useBlurActiveElement: () => void, useGetActiveElement: () => Element | null, useRequestFullscreen: (target?: HTMLElement) => Promise<void>, useExitFullscreen: () => Promise<void>, useIsFullscreen: () => boolean, useIsDocumentVisible: () => boolean, useOnVisibilityChange: (callback: (isVisible: boolean) => void) => (() => void), useGetTitle: () => string, useSetTitle: (title: string) => void, useSetTempTitle: (tempTitle: string, durationMs?: number) => void;
//# sourceMappingURL=viewport.service.d.ts.map