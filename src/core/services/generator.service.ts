import type { ICryptoStrategy, IUuidStrategy } from "../../types/index.js";

/**
 * Loads the Node.js `crypto` module lazily for PBKDF2 hashing.
 *
 * NOTE: this is a one-way hash, not encryption. Do not rely on the fixed
 * default salt for real password hashing; prefer scrypt/argon2id instead.
 */
export class LazyNodeCryptoStrategy implements ICryptoStrategy {
	/**
	 * Derives a PBKDF2-SHA512 hash asynchronously (non-blocking).
	 * @returns `"salt:hashHex"`
	 */
	async useHash(plainText: string, salt?: string): Promise<string> {
		const cryptoModule = await import("node:crypto");
		// Supports both CJS and pure ESM environments.
		const cryptoInstance = cryptoModule.default ?? cryptoModule;

		const actualSalt = salt ?? cryptoInstance.randomBytes(16).toString("hex");

		const hash = await new Promise<string>((resolve, reject) => {
			cryptoInstance.pbkdf2(plainText, actualSalt, 100000, 64, "sha512", (err, derived) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(derived.toString("hex"));
			});
		});

		return `${actualSalt}:${hash}`;
	}

	/**
	 * @deprecated Use {@link useHash} — this is PBKDF2 hashing, not encryption.
	 */
	async useEncrypt(plainText: string, salt?: string): Promise<string> {
		return this.useHash(plainText, salt);
	}
}

/**
 * Native UUID strategy using `globalThis.crypto.randomUUID`, with a fallback.
 */
export class NativeUuidStrategy implements IUuidStrategy {
	useGenerate(): string {
		if (
			typeof globalThis.crypto !== "undefined" &&
			typeof globalThis.crypto.randomUUID === "function"
		) {
			return globalThis.crypto.randomUUID();
		}
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
			const r = (Math.random() * 16) | 0;
			const v = c === "x" ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}
}

/**
 * Generator facade (Singleton + Strategy) for ids, slugs, tokens and hashing.
 */
export default class GeneratorService {
	private static instance: GeneratorService;
	private counter = 0;

	private cryptoStrategy: LazyNodeCryptoStrategy;
	private uuidStrategy: IUuidStrategy;

	private constructor() {
		this.cryptoStrategy = new LazyNodeCryptoStrategy();
		this.uuidStrategy = new NativeUuidStrategy();
	}

	public static getInstance(): GeneratorService {
		if (!GeneratorService.instance) {
			GeneratorService.instance = new GeneratorService();
		}
		return GeneratorService.instance;
	}

	public useNumericId = (): number => ++this.counter;

	public useUuid = (): string => this.uuidStrategy.useGenerate();

	public useSlugify = (text: string): string => {
		if (!text) throw new Error("Text is required for slugify");

		return text
			.toString()
			.trim()
			.toLowerCase()
			.normalize("NFD")
			.replace(/\p{M}/gu, "")
			.replace(/\s+/g, "-")
			.replace(/[^\w-]+/g, "")
			.replace(/--+/g, "-")
			.replace(/^-+/, "")
			.replace(/-+$/, "");
	};

	/**
	 * Returns a cryptographically strong 6-digit numeric token (100000–999999).
	 */
	public useToken = (): number => {
		if (typeof globalThis.crypto?.getRandomValues === "function") {
			const buffer = new Uint32Array(1);
			globalThis.crypto.getRandomValues(buffer);
			return 100000 + (buffer[0] % 900000);
		}
		return Math.floor(100000 + Math.random() * 900000);
	};

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
	public useHash = async (plainText: string, salt?: string): Promise<string> =>
		this.cryptoStrategy.useHash(plainText, salt);

	/**
	 * @deprecated Use {@link useHash} — this is PBKDF2 hashing, not encryption.
	 */
	public useEncrypt = async (plainText: string, salt?: string): Promise<string> =>
		this.cryptoStrategy.useEncrypt(plainText, salt);

	/**
	 * Alias for {@link useHash}.
	 */
	public usePbkdf2Hash = async (plainText: string, salt?: string): Promise<string> =>
		this.cryptoStrategy.useHash(plainText, salt);
}

// Singleton instance and destructured exports.
export const {
	useSlugify,
	useUuid,
	useNumericId,
	useToken,
	useHash,
	usePbkdf2Hash,
	useEncrypt,
}: GeneratorService = GeneratorService.getInstance();
