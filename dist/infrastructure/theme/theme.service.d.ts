import type { ThemeMode, ThemeOptions } from "../../types/index.js";
/**
 * Initializes the theme system. Reads the stored preference (or falls back
 * to `defaultMode`), applies the theme, and registers a system color-scheme
 * listener for `"system"` mode.
 *
 * @param options - Configuration for the theme system.
 *
 * @example
 * ```ts
 * useInitTheme({
 *   defaultMode: "dark",
 *   storageKey: "app-theme",
 *   onChange: (mode, resolved) => console.log(mode, resolved),
 * });
 * ```
 */
export declare const useInitTheme: (options?: ThemeOptions) => void;
/**
 * Sets the theme mode and persists it to storage.
 *
 * @param mode - The desired theme mode (`"light"`, `"dark"`, or `"system"`).
 *
 * @example
 * ```ts
 * useSetThemeMode("dark");
 * ```
 */
export declare const useSetThemeMode: (newMode: ThemeMode) => void;
/**
 * Returns the current theme mode (may be `"system"`).
 *
 * @returns The active {@link ThemeMode}.
 *
 * @example
 * ```ts
 * const current = useGetThemeMode(); // "light" | "dark" | "system"
 * ```
 */
export declare const useGetThemeMode: () => ThemeMode;
/**
 * Returns the resolved theme (`"light"` or `"dark"`), accounting for system
 * preference when mode is `"system"`.
 *
 * @returns The resolved color scheme.
 *
 * @example
 * ```ts
 * const scheme = useGetResolved(); // "light" or "dark"
 * ```
 */
export declare const useGetResolved: () => "light" | "dark";
/**
 * Checks whether the user's OS is set to prefer a dark color scheme.
 *
 * @returns `true` if the system prefers dark mode.
 *
 * @example
 * ```ts
 * if (usePrefersColorScheme()) {
 *   // user prefers dark
 * }
 * ```
 */
export declare const usePrefersColorScheme: () => boolean;
/**
 * Toggles between `"light"` and `"dark"` (ignores `"system"`).
 *
 * @example
 * ```ts
 * useToggleTheme(); // light -> dark, dark -> light
 * ```
 */
export declare const useToggleTheme: () => void;
/**
 * Resets the theme to `"system"` and removes the stored preference.
 *
 * @example
 * ```ts
 * useResetTheme();
 * ```
 */
export declare const useResetTheme: () => void;
/**
 * Cleans up the media-query listener. Call this when the theme system is
 * no longer needed (e.g. during teardown in tests).
 *
 * @example
 * ```ts
 * useDestroyTheme();
 * ```
 */
export declare const useDestroyTheme: () => void;
//# sourceMappingURL=theme.service.d.ts.map