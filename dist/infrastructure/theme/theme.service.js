import { useAddClass, useGetRoot, useOn, useRemoveClass, useSetAttribute, } from "../dom/dom.service.js";
import { useGetStorage, useRemoveStorage, useSetStorage } from "../storage/storage.service.js";
const VALID_THEME_MODES = ["light", "dark", "system"];
function isThemeMode(value) {
    return typeof value === "string" && VALID_THEME_MODES.includes(value);
}
/**
 * Theme facade (Singleton) over the DOM and Storage, with a media-query listener.
 */
export class ThemeService {
    static instance;
    mode = "system";
    storageKey = "theme";
    attribute = "data-theme";
    target = null;
    onChange;
    mediaQuery = null;
    cleanMediaQueryListener = null;
    constructor() { }
    static getInstance() {
        if (!ThemeService.instance) {
            ThemeService.instance = new ThemeService();
        }
        return ThemeService.instance;
    }
    IS_BROWSER = () => {
        return typeof window !== "undefined" && typeof document !== "undefined";
    };
    useInitTheme = (options = {}) => {
        if (!this.IS_BROWSER())
            return;
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
    useSetThemeMode = (mode) => {
        if (!this.IS_BROWSER())
            return;
        this.mode = isThemeMode(mode) ? mode : "system";
        useSetStorage(this.storageKey, this.mode, "localStorage");
        this.APPLY_THEME();
    };
    useGetThemeMode = () => this.mode;
    useGetResolved = () => {
        if (this.mode !== "system")
            return this.mode;
        return this.usePrefersColorScheme() ? "dark" : "light";
    };
    usePrefersColorScheme = () => {
        if (!this.IS_BROWSER() || !window.matchMedia)
            return false;
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    };
    useToggleTheme = () => {
        const current = this.useGetResolved();
        this.useSetThemeMode(current === "light" ? "dark" : "light");
    };
    useResetTheme = () => {
        if (!this.IS_BROWSER())
            return;
        useRemoveStorage(this.storageKey);
        this.mode = "system";
        this.APPLY_THEME();
    };
    useDestroyTheme = () => {
        if (this.cleanMediaQueryListener) {
            this.cleanMediaQueryListener();
            this.cleanMediaQueryListener = null;
            this.mediaQuery = null;
        }
    };
    APPLY_THEME = () => {
        if (!this.target)
            return;
        const resolved = this.useGetResolved();
        // Set the attribute, e.g. data-theme="dark".
        useSetAttribute(this.target, this.attribute, resolved);
        // Toggle CSS classes.
        useRemoveClass(this.target, ["light", "dark"]);
        useAddClass(this.target, resolved);
        this.onChange?.(this.mode, resolved);
    };
    SETUP_MEDIA_QUERY_LISTENER = () => {
        if (!this.IS_BROWSER() || !window.matchMedia)
            return;
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
export const THEME_SERVICE = ThemeService.getInstance();
export const { useInitTheme, useSetThemeMode, useGetThemeMode, useGetResolved, usePrefersColorScheme, useToggleTheme, useResetTheme, useDestroyTheme, } = THEME_SERVICE;
//# sourceMappingURL=theme.service.js.map