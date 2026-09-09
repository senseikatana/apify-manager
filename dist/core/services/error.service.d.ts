import type { ISerializedError } from "../../types/index.js";
/**
 * Serialize an error into a plain object.
 * Uses sensible defaults based on the status code when message is omitted.
 *
 * @param message - Error message (falls back to status code default)
 * @param code - HTTP status code (default: 400)
 * @returns Serialized error with message and code
 *
 * @example
 * ```ts
 * const err = useErrorSerialize("User not found", 404);
 * // { message: "User not found", code: 404 }
 *
 * const err2 = useErrorSerialize("", 500);
 * // { message: "Internal Server Error", code: 500 }
 * ```
 */
export declare function useErrorSerialize(message?: string, code?: number): ISerializedError;
/**
 * Create a custom error object. Use with `useLogger` for consistent error logging.
 *
 * @param msg - Error message
 * @param code - HTTP status code
 * @returns Serialized error with message and code
 *
 * @example
 * ```ts
 * import { useErrorCustom, useLogger } from "katanakit-js";
 *
 * const error = useErrorCustom("User not found", 404);
 * useLogger("error", error.message, error);
 * // { message: "User not found", code: 404 }
 * ```
 */
export declare function useErrorCustom(msg: string, code: number): ISerializedError;
//# sourceMappingURL=error.service.d.ts.map