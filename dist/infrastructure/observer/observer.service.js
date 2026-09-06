import { useLogger } from "../../core/services/logger.service.js";
/**
 * Singleton wrapper around the native IntersectionObserver API.
 */
export class ObserverService {
    static instance;
    registry = new Map();
    constructor() { }
    static getInstance() {
        if (!ObserverService.instance) {
            ObserverService.instance = new ObserverService();
        }
        return ObserverService.instance;
    }
    static useIsSupported() {
        return typeof window !== "undefined" && "IntersectionObserver" in window;
    }
    useCreate(key, callback, options = { threshold: 0.1 }, autoUnobserve = true) {
        if (!ObserverService.useIsSupported()) {
            useLogger("[ObserverService] IntersectionObserver not supported.", "warn");
            return this;
        }
        if (this.registry.has(key)) {
            this.useDisconnect(key);
        }
        const config = { callback, options, autoUnobserve };
        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    config.callback(entry);
                    if (config.autoUnobserve) {
                        this.useUnobserve(key, entry.target);
                    }
                }
            }
        }, config.options);
        this.registry.set(key, { config, observer, targets: new Set() });
        return this;
    }
    resolveTarget(element) {
        return typeof element === "string" ? document.querySelector(element) : element;
    }
    useObserve(key, element) {
        const entry = this.registry.get(key);
        if (!entry?.observer)
            return this;
        const target = this.resolveTarget(element);
        if (!target) {
            useLogger(`[ObserverService] Target not found for key "${key}":`, element, "warn");
            return this;
        }
        entry.targets.add(target);
        entry.observer.observe(target);
        return this;
    }
    useObserveAll(key, selector) {
        if (!ObserverService.useIsSupported())
            return this;
        for (const el of document.querySelectorAll(selector)) {
            this.useObserve(key, el);
        }
        return this;
    }
    useUnobserve(key, element) {
        const entry = this.registry.get(key);
        if (!entry?.observer)
            return this;
        entry.observer.unobserve(element);
        entry.targets.delete(element);
        return this;
    }
    useDisconnect(key) {
        const entry = this.registry.get(key);
        if (!entry)
            return this;
        entry.observer?.disconnect();
        entry.targets.clear();
        this.registry.delete(key);
        return this;
    }
    useDisconnectAll() {
        for (const key of this.registry.keys()) {
            this.useDisconnect(key);
        }
        return this;
    }
    useHas(key) {
        return this.registry.has(key);
    }
    useKeys() {
        return Array.from(this.registry.keys());
    }
}
/**
 * Singleton service for lazy loading images using IntersectionObserver.
 */
export class LazyLoaderService {
    static instance;
    registry = new Map();
    constructor() { }
    static getInstance() {
        if (!LazyLoaderService.instance) {
            LazyLoaderService.instance = new LazyLoaderService();
        }
        return LazyLoaderService.instance;
    }
    useInit(key = "default", selector = "img[data-src]", rootMargin = "200px") {
        if (!ObserverService.useIsSupported())
            return this;
        if (this.registry.has(key)) {
            this.useStop(key);
        }
        const observer = ObserverService.getInstance();
        const observerKey = `lazy_loader_${key}`;
        observer.useCreate(observerKey, (entry) => {
            const img = entry.target;
            const dataSrc = img.dataset.src;
            if (dataSrc) {
                img.src = dataSrc;
                img.removeAttribute("data-src");
            }
        }, { rootMargin }, true);
        observer.useObserveAll(observerKey, selector);
        this.registry.set(key, { selector, observerKey });
        return this;
    }
    useStop(key) {
        const entry = this.registry.get(key);
        if (!entry)
            return this;
        ObserverService.getInstance().useDisconnect(entry.observerKey);
        this.registry.delete(key);
        return this;
    }
    useStopAll() {
        for (const key of this.registry.keys()) {
            this.useStop(key);
        }
        return this;
    }
    useHas(key) {
        return this.registry.has(key);
    }
}
//# sourceMappingURL=observer.service.js.map