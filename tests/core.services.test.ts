import { afterEach, describe, expect, it, vi } from "vitest";
import { useCustom, useInternal, useNotFound } from "@/core/services/error.service";
import { useToMiles } from "@/core/services/formatter.service";
import { GeometryUtils } from "@/core/services/geometry.service";
import {
	useCreateBatch,
	useCreateEffect,
	useCreateMemo,
	useCreateSignal,
} from "@/core/services/reactive.service";
import {
	useDebounceImmediate,
	useRace,
	useSetTimeout,
} from "@/core/services/timing.service";
import { useDeepMerge } from "@/core/services/utils.service";
import { useRunStorageScope, useSetStorage } from "@/infrastructure/storage/storage.service";
import {
	useGetThemeMode,
	useInitTheme,
	useSetThemeMode,
} from "@/infrastructure/theme/theme.service";

describe("GeometryUtils", () => {
	it("computes the rectangle area", () => {
		expect(GeometryUtils.area.useRectangle(5, 10)).toBe("50.00");
	});

	it("computes the circle area", () => {
		expect(GeometryUtils.area.useCircle(3)).toBe("28.27");
	});

	it("appends a unit when provided", () => {
		expect(GeometryUtils.perimeter.useCircle(3, { unit: "cm" })).toBe("18.85 cm");
	});
});

describe("ErrorFactoryService", () => {
	it("creates typed errors with status codes", () => {
		expect(useNotFound("Missing").code).toBe(404);
		expect(useInternal().code).toBe(500);
	});

	it("serializes an error", () => {
		expect(useCustom("Teapot", 418).useToJson()).toEqual({
			name: "AppError",
			message: "Teapot",
			code: 418,
		});
	});
});

describe("ReactiveService", () => {
	it("updates a signal and notifies effects", () => {
		const [count, setCount] = useCreateSignal(0);
		let last = 0;

		useCreateEffect(() => {
			last = count();
		}, [count]);

		setCount(5);

		expect(count()).toBe(5);
		expect(last).toBe(5);
	});

	it("recomputes a memo when its dependency changes", () => {
		const [count, setCount] = useCreateSignal(1);
		const doubled = useCreateMemo(() => count() * 2, [count]);

		expect(doubled()).toBe(2);
		setCount(3);
		expect(doubled()).toBe(6);
	});

	it("supports nested batches without flushing early", () => {
		const [count, setCount] = useCreateSignal(0);
		const seen: number[] = [];
		useCreateEffect(() => {
			seen.push(count());
		}, [count]);
		seen.length = 0;

		const batch = useCreateBatch();
		batch(() => {
			setCount(1);
			expect(seen).toEqual([]);
			batch(() => {
				setCount(2);
				expect(seen).toEqual([]);
			});
			expect(seen).toEqual([]);
			setCount(3);
		});

		expect(count()).toBe(3);
		expect(seen.length).toBeGreaterThan(0);
	});
});

describe("ConverterService", () => {
	it("converts kilometers to miles (km / 1.60934)", () => {
		expect(useToMiles(1.60934, "en", 5)).toBe("1.00000");
		expect(Number.parseFloat(useToMiles(10, "en", 2))).toBeCloseTo(6.21, 1);
	});
});

describe("TimingService", () => {
	afterEach(() => {
		vi.useRealTimers();
	});

	it("clears the race timeout when the promise wins", async () => {
		vi.useFakeTimers();
		const unhandled: unknown[] = [];
		const onUnhandled = (reason: unknown) => {
			unhandled.push(reason);
		};
		process.on("unhandledRejection", onUnhandled);

		const slow = new Promise<string>((resolve) => {
			setTimeout(() => resolve("ok"), 10);
		});
		const raced = useRace(slow, 1000);
		await vi.advanceTimersByTimeAsync(10);
		await expect(raced).resolves.toBe("ok");
		await vi.advanceTimersByTimeAsync(2000);
		process.off("unhandledRejection", onUnhandled);
		expect(unhandled).toHaveLength(0);
	});

	it("does not double-fire useDebounceImmediate on the first call", () => {
		vi.useFakeTimers();
		const spy = vi.fn();
		const debounced = useDebounceImmediate(spy, 100);

		debounced("first");
		expect(spy).toHaveBeenCalledTimes(1);

		vi.advanceTimersByTime(100);
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it("rejects useSetTimeout promise on cancel", async () => {
		vi.useFakeTimers();
		const { promise, cancel } = useSetTimeout(() => "done", 1000);
		cancel();
		await expect(promise).rejects.toThrow(/cancelled/i);
	});
});

describe("DataUtils", () => {
	it("ignores prototype-pollution keys in useDeepMerge", () => {
		const target: Record<string, unknown> = { a: 1 };
		const polluted = JSON.parse('{"__proto__":{"polluted":true},"constructor":{"x":1},"b":2}');
		const merged = useDeepMerge(target, polluted);

		expect(merged.b).toBe(2);
		expect(Object.hasOwn(merged, "__proto__")).toBe(false);
		expect(({} as { polluted?: boolean }).polluted).toBeUndefined();
	});
});

describe("ThemeService", () => {
	it("rejects invalid ThemeMode values from storage", () => {
		const root = {
			classList: { add: vi.fn(), remove: vi.fn(), contains: vi.fn(), toggle: vi.fn() },
			setAttribute: vi.fn(),
			getAttribute: vi.fn(),
			removeAttribute: vi.fn(),
		};

		vi.stubGlobal("window", {
			matchMedia: () => ({
				matches: false,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
			}),
		});
		vi.stubGlobal("document", {
			documentElement: root,
		});

		useRunStorageScope(() => {
			useSetStorage("theme", "hacker-mode");
			useInitTheme({
				storageKey: "theme",
				defaultMode: "light",
				target: root as unknown as HTMLElement,
			});
			expect(useGetThemeMode()).toBe("light");

			useSetThemeMode("dark");
			expect(useGetThemeMode()).toBe("dark");
		});

		vi.unstubAllGlobals();
	});
});
