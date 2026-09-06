import { describe, expect, it } from "vitest";

import {
	useClearStorage,
	useGetStorage,
	useRemoveStorage,
	useRunStorageScope,
	useSetStorage,
} from "@/infrastructure/storage/storage.service";

describe("StorageService (SSR in-memory fallback)", () => {
	it("stores and retrieves primitive values inside a storage scope", () => {
		useRunStorageScope(() => {
			useSetStorage("theme", "dark");
			expect(useGetStorage("theme")).toBe("dark");
		});
	});

	it("serializes and deserializes objects", () => {
		useRunStorageScope(() => {
			useSetStorage("user", { id: 1, name: "John" });
			expect(useGetStorage<{ id: number; name: string }>("user")).toEqual({
				id: 1,
				name: "John",
			});
		});
	});

	it("removes a stored value", () => {
		useRunStorageScope(() => {
			useSetStorage("session-token", "abc123");
			useRemoveStorage("session-token");
			expect(useGetStorage("session-token")).toBeNull();
		});
	});

	it("clears the storage", () => {
		useRunStorageScope(() => {
			useSetStorage("cache-key", "value");
			useClearStorage();
			expect(useGetStorage("cache-key")).toBeNull();
		});
	});

	it("isolates storage across separate SSR scopes (no cross-request leak)", () => {
		useRunStorageScope(() => {
			useSetStorage("secret", "request-a");
		});

		useRunStorageScope(() => {
			expect(useGetStorage("secret")).toBeNull();
			useSetStorage("secret", "request-b");
			expect(useGetStorage("secret")).toBe("request-b");
		});
	});

	it("does not persist across calls without a scope", () => {
		useSetStorage("ephemeral", "value");
		expect(useGetStorage("ephemeral")).toBeNull();
	});
});
