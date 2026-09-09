import type { IErrorFactory, ISerializedError } from "../../types/index.js";

/**
 * Decoupled application error with HTTP-style status code.
 *
 * @example
 * ```ts
 * const error = new AppError("User not found", 404);
 * console.log(error.code); // 404
 * console.log(error.useToJson()); // { name: "AppError", message: "User not found", code: 404 }
 * ```
 */
export class AppError extends Error {
	constructor(
		message = "Unknown error",
		public readonly code: number = 400,
	) {
		super(message);
		this.name = "AppError";
		Object.setPrototypeOf(this, AppError.prototype);
	}

	/**
	 * Serialize the error to a plain object.
	 *
	 * @returns Serialized error with name, message and code
	 *
	 * @example
	 * ```ts
	 * const error = new AppError("Forbidden", 403);
	 * const serialized = error.useToJson();
	 * // { name: "AppError", message: "Forbidden", code: 403 }
	 * ```
	 */
	public useToJson = (): ISerializedError => ({
		name: this.name,
		message: this.message,
		code: this.code,
	});
}

/**
 * Create a Bad Request (400) error.
 *
 * @param message - Error message
 * @returns AppError with status 400
 *
 * @example
 * ```ts
 * const error = useBadRequest("Invalid email format");
 * throw error;
 * ```
 */
export const useBadRequest = (message = "Bad Request"): AppError => new AppError(message, 400);

/**
 * Create an Unauthorized (401) error.
 *
 * @param message - Error message
 * @returns AppError with status 401
 *
 * @example
 * ```ts
 * throw useUnauthorized("Token expired");
 * ```
 */
export const useUnauthorized = (message = "Unauthorized"): AppError => new AppError(message, 401);

/**
 * Create a Forbidden (403) error.
 *
 * @param message - Error message
 * @returns AppError with status 403
 *
 * @example
 * ```ts
 * throw useForbidden("Insufficient permissions");
 * ```
 */
export const useForbidden = (message = "Forbidden"): AppError => new AppError(message, 403);

/**
 * Create a Not Found (404) error.
 *
 * @param message - Error message
 * @returns AppError with status 404
 *
 * @example
 * ```ts
 * throw useNotFound("User not found");
 * ```
 */
export const useNotFound = (message = "Not Found"): AppError => new AppError(message, 404);

/**
 * Create an Internal Server Error (500) error.
 *
 * @param message - Error message
 * @returns AppError with status 500
 *
 * @example
 * ```ts
 * throw useInternal("Database connection failed");
 * ```
 */
export const useInternal = (message = "Internal Server Error"): AppError =>
	new AppError(message, 500);

/**
 * Create a custom error with any status code.
 *
 * @param message - Error message
 * @param code - HTTP status code
 * @returns AppError with custom code
 *
 * @example
 * ```ts
 * throw useCustom("Rate limit exceeded", 429);
 * ```
 */
export const useCustom = (message: string, code: number): AppError => new AppError(message, code);
