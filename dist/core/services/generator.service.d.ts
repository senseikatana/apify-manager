import type { ICryptoStrategy, IUuidStrategy } from "../../types/index.js";
/**
 * Loads the Node.js `crypto` module lazily for PBKDF2 hashing.
 *
 * NOTE: this is a one-way hash, not encryption. Do not rely on the fixed
 * default salt for real password hashing; prefer scrypt/argon2id instead.
 */
export declare class LazyNodeCryptoStrategy implements ICryptoStrategy {
    /**
     * Derives a PBKDF2-SHA512 hash asynchronously (non-blocking).
     * @returns `"salt:hashHex"`
     */
    useHash(plainText: string, salt?: string): Promise<string>;
    /**
     * @deprecated Use {@link useHash} — this is PBKDF2 hashing, not encryption.
     */
    useEncrypt(plainText: string, salt?: string): Promise<string>;
}
/**
 * Native UUID strategy using `globalThis.crypto.randomUUID`, with a fallback.
 */
export declare class NativeUuidStrategy implements IUuidStrategy {
    useGenerate(): string;
}
/**
 * Generator facade (Singleton + Strategy) for ids, slugs, tokens and hashing.
 */
export default class GeneratorService {
    private static instance;
    private counter;
    private cryptoStrategy;
    private uuidStrategy;
    private constructor();
    static getInstance(): GeneratorService;
    useNumericId: () => number;
    useUuid: () => string;
    useSlugify: (text: string) => string;
    /**
     * Returns a cryptographically strong 6-digit numeric token (100000–999999).
     */
    useToken: () => number;
    /**
     * Derives a PBKDF2-SHA512 hash of `plainText`.
     * Returns `"salt:hashHex"`. Prefer a unique salt per secret.
     *
     * @example
     * ```ts
     * import { useHash } from "katanakit-js";
     * const digest = await useHash("secret", "optional-salt");
     * // => "optional-salt:<128 hex chars>"
     * ```
     */
    useHash: (plainText: string, salt?: string) => Promise<string>;
    /**
     * @deprecated Use {@link useHash} — this is PBKDF2 hashing, not encryption.
     */
    useEncrypt: (plainText: string, salt?: string) => Promise<string>;
    /**
     * Alias for {@link useHash}.
     */
    usePbkdf2Hash: (plainText: string, salt?: string) => Promise<string>;
}
export declare const useSlugify: (text: string) => string, useUuid: () => string, useNumericId: () => number, useToken: () => number, useHash: (plainText: string, salt?: string) => Promise<string>, usePbkdf2Hash: (plainText: string, salt?: string) => Promise<string>, useEncrypt: (plainText: string, salt?: string) => Promise<string>;
//# sourceMappingURL=generator.service.d.ts.map