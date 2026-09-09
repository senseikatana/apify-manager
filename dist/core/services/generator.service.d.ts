import type { ICryptoStrategy, IUuidStrategy } from "../../types/index.js";
/**
 * Lazy Node.js `crypto` strategy for PBKDF2 hashing.
 *
 * Implemented as a plain object satisfying {@link ICryptoStrategy}.
 * Uses dynamic `import("node:crypto")` so it works in both CJS and pure ESM
 * environments without a top-level `require`.
 *
 * **NOTE:** this is a one-way hash, not encryption. Do not rely on the fixed
 * default salt for real password hashing; prefer scrypt/argon2id instead.
 */
export declare const LazyNodeCryptoStrategy: ICryptoStrategy;
/**
 * Native UUID strategy using `globalThis.crypto.randomUUID`, with a fallback.
 *
 * Implemented as a plain object satisfying {@link IUuidStrategy}.
 */
export declare const NativeUuidStrategy: IUuidStrategy;
/**
 * Returns the next auto-incrementing numeric id.
 *
 * @returns A monotonically increasing integer starting from `1`.
 *
 * @example
 * ```ts
 * import { useNumericId } from "katanakit-js";
 *
 * useNumericId(); // 1
 * useNumericId(); // 2
 * ```
 */
export declare function useNumericId(): number;
/**
 * Generates a RFC 4122 v4 UUID string.
 *
 * @returns A UUID string.
 *
 * @example
 * ```ts
 * import { useUuid } from "katanakit-js";
 *
 * const id = useUuid();
 * // => "3b241101-e2bb-4d7a-8615-..."
 * ```
 */
export declare function useUuid(): string;
/**
 * Converts a text string into a URL-friendly slug.
 *
 * @param text - The text to slugify. Must not be empty.
 * @returns A lower-case, hyphen-separated slug with diacritics removed.
 * @throws {Error} If `text` is empty or falsy.
 *
 * @example
 * ```ts
 * import { useSlugify } from "katanakit-js";
 *
 * useSlugify("Hello World!");      // "hello-world"
 * useSlugify("  Café au Lait  ");  // "cafe-au-lait"
 * ```
 */
export declare function useSlugify(text: string): string;
/**
 * Returns a cryptographically strong 6-digit numeric token (100000–999999).
 *
 * @returns A random 6-digit integer.
 *
 * @example
 * ```ts
 * import { useToken } from "katanakit-js";
 *
 * const code = useToken(); // e.g. 482916
 * ```
 */
export declare function useToken(): number;
/**
 * Derives a PBKDF2-SHA512 hash of `plainText`.
 * Returns `"salt:hashHex"`. Prefer a unique salt per secret.
 *
 * @param plainText - The text to hash.
 * @param salt - Optional hex salt. When omitted a random 16-byte salt is generated.
 * @returns `"salt:hashHex"` — the salt and the 128-char hex digest joined by a colon.
 *
 * @example
 * ```ts
 * import { useHash } from "katanakit-js";
 *
 * const digest = await useHash("secret", "optional-salt");
 * // => "optional-salt:<128 hex chars>"
 * ```
 */
export declare function useHash(plainText: string, salt?: string): Promise<string>;
/**
 * @deprecated Use {@link useHash} — this is PBKDF2 hashing, not encryption.
 *
 * @param plainText - The text to hash.
 * @param salt - Optional hex salt.
 * @returns `"salt:hashHex"`.
 *
 * @example
 * ```ts
 * import { useHash } from "katanakit-js";
 * const digest = await useHash("secret");
 * ```
 */
export declare function useEncrypt(plainText: string, salt?: string): Promise<string>;
/**
 * Alias for {@link useHash}.
 *
 * @param plainText - The text to hash.
 * @param salt - Optional hex salt. When omitted a random 16-byte salt is generated.
 * @returns `"salt:hashHex"`.
 *
 * @example
 * ```ts
 * import { usePbkdf2Hash } from "katanakit-js";
 *
 * const digest = await usePbkdf2Hash("secret");
 * // => "<32-char salt>:<128-char hex>"
 * ```
 */
export declare function usePbkdf2Hash(plainText: string, salt?: string): Promise<string>;
//# sourceMappingURL=generator.service.d.ts.map