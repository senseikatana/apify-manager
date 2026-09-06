import { useLogger } from "../../core/services/logger.service.js";

import type {
	LazyLoaderEntry,
	ObserverCallback,
	ObserverConfig,
	ObserverEntry,
	ObserverTarget,
} from "../../types/index.js";

/**
 * Singleton wrapper around the native IntersectionObserver API.
 */
export class ObserverService {
	private static instance: ObserverService;
	private registry: Map<string, ObserverEntry> = new Map();

	private constructor() {}

	static getInstance(): ObserverService {
		if (!ObserverService.instance) {
			ObserverService.instance = new ObserverService();
		}
		return ObserverService.instance;
	}

	static useIsSupported(): boolean {
		return typeof window !== "undefined" && "IntersectionObserver" in window;
	}

	useCreate(
		key: string,
		callback: ObserverCallback,
		options: IntersectionObserverInit = { threshold: 0.1 },
		autoUnobserve = true,
	): this {
		if (!ObserverService.useIsSupported()) {
			useLogger("[ObserverService] IntersectionObserver not supported.", "warn");
			return this;
		}

		if (this.registry.has(key)) {
			this.useDisconnect(key);
		}

		const config: ObserverConfig = { callback, options, autoUnobserve };

		const observer = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					config.callback(entry);
					if (config.autoUnobserve) {
						this.useUnobserve(key, entry.target as HTMLElement);
					}
				}
			}
		}, config.options);

		this.registry.set(key, { config, observer, targets: new Set() });
		return this;
	}

	private resolveTarget(element: ObserverTarget): HTMLElement | null {
		return typeof element === "string" ? document.querySelector<HTMLElement>(element) : element;
	}

	useObserve(key: string, element: ObserverTarget): this {
		const entry = this.registry.get(key);
		if (!entry?.observer) return this;

		const target = this.resolveTarget(element);
		if (!target) {
			useLogger(`[ObserverService] Target not found for key "${key}":`, element, "warn");
			return this;
		}

		entry.targets.add(target);
		entry.observer.observe(target);
		return this;
	}

	useObserveAll(key: string, selector: string): this {
		if (!ObserverService.useIsSupported()) return this;
		for (const el of document.querySelectorAll<HTMLElement>(selector)) {
			this.useObserve(key, el);
		}
		return this;
	}

	useUnobserve(key: string, element: HTMLElement): this {
		const entry = this.registry.get(key);
		if (!entry?.observer) return this;

		entry.observer.unobserve(element);
		entry.targets.delete(element);
		return this;
	}

	useDisconnect(key: string): this {
		const entry = this.registry.get(key);
		if (!entry) return this;

		entry.observer?.disconnect();
		entry.targets.clear();
		this.registry.delete(key);
		return this;
	}

	useDisconnectAll(): this {
		for (const key of this.registry.keys()) {
			this.useDisconnect(key);
		}
		return this;
	}

	useHas(key: string): boolean {
		return this.registry.has(key);
	}

	useKeys(): string[] {
		return Array.from(this.registry.keys());
	}
}

/**
 * Singleton service for lazy loading images using IntersectionObserver.
 */
export class LazyLoaderService {
	private static instance: LazyLoaderService;
	private registry: Map<string, LazyLoaderEntry> = new Map();

	private constructor() {}

	static getInstance(): LazyLoaderService {
		if (!LazyLoaderService.instance) {
			LazyLoaderService.instance = new LazyLoaderService();
		}
		return LazyLoaderService.instance;
	}

	useInit(key = "default", selector = "img[data-src]", rootMargin = "200px"): this {
		if (!ObserverService.useIsSupported()) return this;

		if (this.registry.has(key)) {
			this.useStop(key);
		}

		const observer = ObserverService.getInstance();
		const observerKey = `lazy_loader_${key}`;

		observer.useCreate(
			observerKey,
			(entry) => {
				const img = entry.target as HTMLImageElement;
				const dataSrc = img.dataset.src;
				if (dataSrc) {
					img.src = dataSrc;
					img.removeAttribute("data-src");
				}
			},
			{ rootMargin },
			true,
		);

		observer.useObserveAll(observerKey, selector);
		this.registry.set(key, { selector, observerKey });
		return this;
	}

	useStop(key: string): this {
		const entry = this.registry.get(key);
		if (!entry) return this;

		ObserverService.getInstance().useDisconnect(entry.observerKey);
		this.registry.delete(key);
		return this;
	}

	useStopAll(): this {
		for (const key of this.registry.keys()) {
			this.useStop(key);
		}
		return this;
	}

	useHas(key: string): boolean {
		return this.registry.has(key);
	}
}
