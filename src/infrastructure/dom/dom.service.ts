import type { IDomService } from "../../types/index.js";

// ============================================================
// DOM facade (Singleton) over `document`, with SSR-safe guards.
// ============================================================
export class DomService implements IDomService {
	private static instance: DomService;

	private constructor() {}

	public static getInstance(): DomService {
		if (!DomService.instance) {
			DomService.instance = new DomService();
		}
		return DomService.instance;
	}

	public useIsBrowser = (): boolean =>
		typeof window !== "undefined" && typeof document !== "undefined";

	public useGetRoot = (): HTMLElement | null => {
		if (!this.useIsBrowser()) return null;
		return document.documentElement;
	};

	public useGetBody = (): HTMLBodyElement | null => {
		if (!this.useIsBrowser()) return null;
		return document.body as HTMLBodyElement | null;
	};

	private RESOLVE = <T extends Element = HTMLElement>(target: T | string): T | null => {
		return typeof target === "string" ? this.useQuerySelector<T>(target) : target;
	};

	public useGetElementById = <T extends HTMLElement = HTMLElement>(id: string): T | null => {
		if (!this.useIsBrowser()) return null;
		return document.getElementById(id) as T | null;
	};

	public useGetElementByClass = <T extends HTMLElement = HTMLElement>(
		className: string,
	): T | null => {
		if (!this.useIsBrowser()) return null;
		const formattedSelector = className.startsWith(".") ? className : `.${className}`;
		return document.querySelector<T>(formattedSelector);
	};

	public useQuerySelector: {
		<K extends keyof HTMLElementTagNameMap>(selector: K): HTMLElementTagNameMap[K] | null;
		<E extends Element = HTMLElement>(selector: string): E | null;
	} = <E extends Element = HTMLElement>(selector: string): E | null => {
		if (!this.useIsBrowser()) return null;
		return document.querySelector<E>(selector);
	};

	public useQuerySelectorAll: {
		<K extends keyof HTMLElementTagNameMap>(selector: K): HTMLElementTagNameMap[K][];
		<E extends Element = HTMLElement>(selector: string): E[];
	} = <E extends Element = HTMLElement>(selector: string): E[] => {
		if (!this.useIsBrowser()) return [];
		return Array.from(document.querySelectorAll<E>(selector));
	};

	public useAddClass = (target: Element | string, className: string): void => {
		this.RESOLVE(target)?.classList.add(className);
	};

	public useRemoveClass = (target: Element | string, className: string | string[]): void => {
		const el = this.RESOLVE(target);
		if (!el) return;
		if (Array.isArray(className)) {
			el.classList.remove(...className);
		} else {
			el.classList.remove(className);
		}
	};

	public useToggleClass = (
		target: Element | string,
		className: string,
		force?: boolean,
	): boolean | undefined => {
		return this.RESOLVE(target)?.classList.toggle(className, force);
	};

	public useHasClass = (target: Element | string, className: string): boolean => {
		return this.RESOLVE(target)?.classList.contains(className) ?? false;
	};

	public useGetAttribute = (target: Element | string, attr: string): string | null => {
		return this.RESOLVE(target)?.getAttribute(attr) ?? null;
	};

	public useSetAttribute = (target: Element | string, attr: string, value: string): void => {
		// Block event-handler attributes to prevent XSS.
		if (/^on/i.test(attr)) {
			throw new Error(`[DomService] Attribute "${attr}" is not allowed. Use useOn() for events.`);
		}

		const normalizedAttr = attr.toLowerCase();
		const urlLikeAttrs = new Set(["href", "src", "xlink:href", "action", "formaction"]);
		if (urlLikeAttrs.has(normalizedAttr) && /^\s*javascript:/i.test(value)) {
			throw new Error(
				`[DomService] javascript: URLs are not allowed in attribute "${attr}".`,
			);
		}
		if (normalizedAttr === "srcdoc" && /(?:javascript:|<script\b)/i.test(value)) {
			throw new Error(`[DomService] Potentially unsafe srcdoc value is not allowed.`);
		}

		this.RESOLVE(target)?.setAttribute(attr, value);
	};

	public useRemoveAttribute = (target: Element | string, attr: string): void => {
		this.RESOLVE(target)?.removeAttribute(attr);
	};

	public useGetDataAttribute = (target: HTMLElement | string, key: string): string | undefined => {
		return this.RESOLVE<HTMLElement>(target)?.dataset[key];
	};

	public useSetDataAttribute = (target: HTMLElement | string, key: string, value: string): void => {
		const el = this.RESOLVE<HTMLElement>(target);
		if (el) el.dataset[key] = value;
	};

	public useOn = <K extends keyof HTMLElementEventMap>(
		target: EventTarget | string,
		event: K,
		callback: (event: HTMLElementEventMap[K]) => void,
		options?: boolean | AddEventListenerOptions,
	): (() => void) | null => {
		if (!this.useIsBrowser()) return null;
		const el = typeof target === "string" ? this.useQuerySelector(target) : target;
		if (!el) return null;

		const handler = callback as EventListener;
		el.addEventListener(event, handler, options);
		return () => el.removeEventListener(event, handler, options);
	};

	public useCreateElement = <T extends keyof HTMLElementTagNameMap>(
		tagName: T,
		options?: ElementCreationOptions,
	): HTMLElementTagNameMap[T] => {
		if (!this.useIsBrowser()) {
			throw new Error("Cannot create elements in non-browser environment");
		}
		return document.createElement<T>(tagName, options);
	};

	/**
	 * Sets `innerHTML` on the target element.
	 *
	 * **XSS risk:** this is an HTML injection sink. Never pass unsanitized
	 * user input. Prefer {@link useSetText} for plain text, or sanitize with
	 * a trusted library (e.g. DOMPurify) before calling this method.
	 *
	 * @example
	 * ```ts
	 * // Safe — trusted static markup
	 * useSetHtml("#banner", "<strong>Hello</strong>");
	 *
	 * // Unsafe — do NOT do this with user content
	 * // useSetHtml("#out", userInput);
	 * ```
	 */
	public useSetHtml = (target: Element | string, html: string): void => {
		const el = this.RESOLVE(target);
		if (el) el.innerHTML = html ?? "";
	};

	public useSetText = (target: Element | string, text: string): void => {
		const el = this.RESOLVE(target);
		if (el) el.textContent = text;
	};

	public useAppend = (target: Element | string, child: Element | string): void => {
		const parent = this.RESOLVE(target);
		const childEl = this.RESOLVE(child);
		if (parent && childEl) parent.appendChild(childEl);
	};

	public useRemove = (target: Element | string): void => {
		this.RESOLVE(target)?.remove();
	};
}

// Singleton instance and destructured exports.
export const DOM_SERVICE: DomService = DomService.getInstance();

export const {
	useIsBrowser,
	useGetRoot,
	useGetBody,
	useGetElementById,
	useGetElementByClass,
	useQuerySelector,
	useQuerySelectorAll,
	useAddClass,
	useRemoveClass,
	useToggleClass,
	useHasClass,
	useGetAttribute,
	useSetAttribute,
	useRemoveAttribute,
	useGetDataAttribute,
	useSetDataAttribute,
	useOn,
	useCreateElement,
	useSetHtml,
	useSetText,
	useAppend,
	useRemove,
}: DomService = DOM_SERVICE;
