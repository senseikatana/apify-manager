import type { ScrollOptions, ScrollPosition, ViewportSize } from "../../types/index.js";

/**
 * Viewport, scroll and window utilities. All methods are SSR-safe.
 */
export default class ViewportService {
	private static instance: ViewportService;
	private tempTitleTimer: ReturnType<typeof setTimeout> | undefined;
	private tempTitleOriginal: string | undefined;

	private constructor() {}

	public static getInstance(): ViewportService {
		if (!ViewportService.instance) {
			ViewportService.instance = new ViewportService();
		}
		return ViewportService.instance;
	}

	private isBrowser = (): boolean =>
		typeof window !== "undefined" && typeof document !== "undefined";

	public useGetViewportSize = (): ViewportSize => {
		if (!this.isBrowser()) return { width: 0, height: 0 };
		return { width: window.innerWidth, height: window.innerHeight };
	};

	public useMatchesMedia = (query: string): boolean => {
		if (!this.isBrowser() || !window.matchMedia) return false;
		return window.matchMedia(query).matches;
	};

	public usePrefersReducedMotion = (): boolean =>
		this.useMatchesMedia("(prefers-reduced-motion: reduce)");

	public usePrefersDarkMode = (): boolean => this.useMatchesMedia("(prefers-color-scheme: dark)");

	public useGetScrollY = (): number => (this.isBrowser() ? window.scrollY : 0);

	public useGetScrollX = (): number => (this.isBrowser() ? window.scrollX : 0);

	public useGetScrollPosition = (): ScrollPosition => ({
		x: this.useGetScrollX(),
		y: this.useGetScrollY(),
	});

	public useGetScrollProgress = (): number => {
		if (!this.isBrowser()) return 0;
		const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
		if (scrollHeight <= 0) return 0;
		return Math.min(1, Math.max(0, window.scrollY / scrollHeight));
	};

	public useIsAtTop = (threshold = 0): boolean => this.useGetScrollY() <= threshold;

	public useIsAtBottom = (threshold = 50): boolean => {
		if (!this.isBrowser()) return false;
		const scrollHeight = document.documentElement.scrollHeight;
		return window.scrollY + window.innerHeight >= scrollHeight - threshold;
	};

	public useScrollTo = (x = 0, y = 0, behavior: ScrollBehavior = "smooth"): void => {
		if (!this.isBrowser()) return;
		const finalBehavior = this.usePrefersReducedMotion() ? "auto" : behavior;
		window.scrollTo({ top: y, left: x, behavior: finalBehavior });
	};

	public useScrollToTop = (smooth = true): void => {
		if (!this.isBrowser()) return;
		const behavior: ScrollBehavior = smooth && !this.usePrefersReducedMotion() ? "smooth" : "auto";
		window.scrollTo({ top: 0, behavior });
	};

	public useScrollToBottom = (smooth = true): void => {
		if (!this.isBrowser()) return;
		const behavior: ScrollBehavior = smooth && !this.usePrefersReducedMotion() ? "smooth" : "auto";
		const scrollHeight = document.documentElement.scrollHeight;
		window.scrollTo({ top: scrollHeight, behavior });
	};

	public useScrollToElement = (
		target: HTMLElement | string,
		options: ScrollOptions = {},
	): boolean => {
		if (!this.isBrowser()) return false;

		const element = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;

		if (!element) return false;

		const behavior: ScrollBehavior = this.usePrefersReducedMotion()
			? "auto"
			: (options.behavior ?? "smooth");

		element.scrollIntoView({
			behavior,
			block: options.block ?? "start",
			inline: options.inline ?? "nearest",
		});

		return true;
	};

	public usePrintPage = (): void => {
		if (this.isBrowser()) window.print();
	};

	public useFocusElement = (target: HTMLElement | string): boolean => {
		if (!this.isBrowser()) return false;

		const element = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;

		if (!element) return false;

		element.focus();
		return true;
	};

	public useBlurActiveElement = (): void => {
		if (!this.isBrowser()) return;
		(document.activeElement as HTMLElement | null)?.blur();
	};

	public useGetActiveElement = (): Element | null =>
		this.isBrowser() ? document.activeElement : null;

	public useRequestFullscreen = async (target?: HTMLElement): Promise<void> => {
		if (!this.isBrowser() || !document.fullscreenEnabled) {
			throw new Error("Fullscreen not supported");
		}

		const element = target ?? document.documentElement;
		await element.requestFullscreen();
	};

	public useExitFullscreen = async (): Promise<void> => {
		if (!this.isBrowser() || !document.fullscreenElement) return;
		await document.exitFullscreen();
	};

	public useIsFullscreen = (): boolean => this.isBrowser() && !!document.fullscreenElement;

	public useIsDocumentVisible = (): boolean => {
		if (!this.isBrowser()) return true;
		return document.visibilityState === "visible";
	};

	public useOnVisibilityChange = (callback: (isVisible: boolean) => void): (() => void) => {
		if (!this.isBrowser()) return () => {};

		const handler = () => callback(this.useIsDocumentVisible());
		document.addEventListener("visibilitychange", handler);

		return () => document.removeEventListener("visibilitychange", handler);
	};

	public useGetTitle = (): string => (this.isBrowser() ? document.title : "");

	public useSetTitle = (title: string): void => {
		if (this.isBrowser()) document.title = title;
	};

	public useSetTempTitle = (tempTitle: string, durationMs = 3000): void => {
		if (!this.isBrowser()) return;

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
export const {
	useGetViewportSize,
	useMatchesMedia,
	usePrefersReducedMotion,
	usePrefersDarkMode,
	useGetScrollY,
	useGetScrollX,
	useGetScrollPosition,
	useGetScrollProgress,
	useIsAtTop,
	useIsAtBottom,
	useScrollTo,
	useScrollToTop,
	useScrollToBottom,
	useScrollToElement,
	usePrintPage,
	useFocusElement,
	useBlurActiveElement,
	useGetActiveElement,
	useRequestFullscreen,
	useExitFullscreen,
	useIsFullscreen,
	useIsDocumentVisible,
	useOnVisibilityChange,
	useGetTitle,
	useSetTitle,
	useSetTempTitle,
}: ViewportService = ViewportService.getInstance();
