import type { IThemeService, ThemeMode, ThemeOptions } from "../../types/index.js";
import {
	useAddClass,
	useGetRoot,
	useOn,
	useRemoveClass,
	useSetAttribute,
} from "../dom/dom.service.js";
import { useGetStorage, useRemoveStorage, useSetStorage } from "../storage/storage.service.js";

const VALID_THEME_MODES: readonly ThemeMode[] = ["light", "dark", "system"];

function isThemeMode(value: unknown): value is ThemeMode {
	return typeof value === "string" && (VALID_THEME_MODES as readonly string[]).includes(value);
}

/**
 * Theme facade (Singleton) over the DOM and Storage, with a media-query listener.
 */
export class ThemeService implements IThemeService {
	private static instance: ThemeService;

	private mode: ThemeMode = "system";
	private storageKey = "theme";
	private attribute = "data-theme";
	private target: HTMLElement | null = null;
	private onChange?: (mode: ThemeMode, resolved: "light" | "dark") => void;
	private mediaQuery: MediaQueryList | null = null;
	private cleanMediaQueryListener: (() => void) | null = null;

	private constructor() {}

	public static getInstance(): ThemeService {
		if (!ThemeService.instance) {
			ThemeService.instance = new ThemeService();
		}
		return ThemeService.instance;
	}

	private IS_BROWSER = (): boolean => {
		return typeof window !== "undefined" && typeof document !== "undefined";
	};

	public useInitTheme = (options: ThemeOptions = {}): void => {
		if (!this.IS_BROWSER()) return;

		this.storageKey = options.storageKey ?? "theme";
		this.attribute = options.attribute ?? "data-theme";
		this.target = options.target ?? useGetRoot();
		this.onChange = options.onChange;

		const stored = useGetStorage(this.storageKey);
		const defaultMode = isThemeMode(options.defaultMode) ? options.defaultMode : "system";
		this.mode = isThemeMode(stored) ? stored : defaultMode;

		this.APPLY_THEME();
		this.SETUP_MEDIA_QUERY_LISTENER();
	};

	public useSetThemeMode = (mode: ThemeMode): void => {
		if (!this.IS_BROWSER()) return;

		this.mode = isThemeMode(mode) ? mode : "system";
		useSetStorage(this.storageKey, this.mode, "localStorage");
		this.APPLY_THEME();
	};

	public useGetThemeMode = (): ThemeMode => this.mode;

	public useGetResolved = (): "light" | "dark" => {
		if (this.mode !== "system") return this.mode;
		return this.usePrefersColorScheme() ? "dark" : "light";
	};

	public usePrefersColorScheme = (): boolean => {
		if (!this.IS_BROWSER() || !window.matchMedia) return false;
		return window.matchMedia("(prefers-color-scheme: dark)").matches;
	};

	public useToggleTheme = (): void => {
		const current = this.useGetResolved();
		this.useSetThemeMode(current === "light" ? "dark" : "light");
	};

	public useResetTheme = (): void => {
		if (!this.IS_BROWSER()) return;
		useRemoveStorage(this.storageKey);
		this.mode = "system";
		this.APPLY_THEME();
	};

	public useDestroyTheme = (): void => {
		if (this.cleanMediaQueryListener) {
			this.cleanMediaQueryListener();
			this.cleanMediaQueryListener = null;
			this.mediaQuery = null;
		}
	};

	private APPLY_THEME = (): void => {
		if (!this.target) return;

		const resolved = this.useGetResolved();

		// Set the attribute, e.g. data-theme="dark".
		useSetAttribute(this.target, this.attribute, resolved);

		// Toggle CSS classes.
		useRemoveClass(this.target, ["light", "dark"]);
		useAddClass(this.target, resolved);

		this.onChange?.(this.mode, resolved);
	};

	private SETUP_MEDIA_QUERY_LISTENER = (): void => {
		if (!this.IS_BROWSER() || !window.matchMedia) return;

		// Clean up any existing listener before registering a new one.
		if (this.cleanMediaQueryListener) {
			this.cleanMediaQueryListener();
			this.cleanMediaQueryListener = null;
		}

		this.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		// Register the listener using DomService.
		this.cleanMediaQueryListener = useOn(this.mediaQuery, "change", () => {
			if (this.mode === "system") {
				this.APPLY_THEME();
			}
		});
	};
}

// Singleton instance and safe export.
export const THEME_SERVICE: ThemeService = ThemeService.getInstance();

export const {
	useInitTheme,
	useSetThemeMode,
	useGetThemeMode,
	useGetResolved,
	usePrefersColorScheme,
	useToggleTheme,
	useResetTheme,
	useDestroyTheme,
}: ThemeService = THEME_SERVICE;
