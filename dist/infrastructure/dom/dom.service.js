// ============================================================
// DOM facade (Singleton) over `document`, with SSR-safe guards.
// ============================================================
export class DomService {
    static instance;
    constructor() { }
    static getInstance() {
        if (!DomService.instance) {
            DomService.instance = new DomService();
        }
        return DomService.instance;
    }
    useIsBrowser = () => typeof window !== "undefined" && typeof document !== "undefined";
    useGetRoot = () => {
        if (!this.useIsBrowser())
            return null;
        return document.documentElement;
    };
    useGetBody = () => {
        if (!this.useIsBrowser())
            return null;
        return document.body;
    };
    RESOLVE = (target) => {
        return typeof target === "string" ? this.useQuerySelector(target) : target;
    };
    useGetElementById = (id) => {
        if (!this.useIsBrowser())
            return null;
        return document.getElementById(id);
    };
    useGetElementByClass = (className) => {
        if (!this.useIsBrowser())
            return null;
        const formattedSelector = className.startsWith(".") ? className : `.${className}`;
        return document.querySelector(formattedSelector);
    };
    useQuerySelector = (selector) => {
        if (!this.useIsBrowser())
            return null;
        return document.querySelector(selector);
    };
    useQuerySelectorAll = (selector) => {
        if (!this.useIsBrowser())
            return [];
        return Array.from(document.querySelectorAll(selector));
    };
    useAddClass = (target, className) => {
        this.RESOLVE(target)?.classList.add(className);
    };
    useRemoveClass = (target, className) => {
        const el = this.RESOLVE(target);
        if (!el)
            return;
        if (Array.isArray(className)) {
            el.classList.remove(...className);
        }
        else {
            el.classList.remove(className);
        }
    };
    useToggleClass = (target, className, force) => {
        return this.RESOLVE(target)?.classList.toggle(className, force);
    };
    useHasClass = (target, className) => {
        return this.RESOLVE(target)?.classList.contains(className) ?? false;
    };
    useGetAttribute = (target, attr) => {
        return this.RESOLVE(target)?.getAttribute(attr) ?? null;
    };
    useSetAttribute = (target, attr, value) => {
        // Block event-handler attributes to prevent XSS.
        if (/^on/i.test(attr)) {
            throw new Error(`[DomService] Attribute "${attr}" is not allowed. Use useOn() for events.`);
        }
        const normalizedAttr = attr.toLowerCase();
        const urlLikeAttrs = new Set(["href", "src", "xlink:href", "action", "formaction"]);
        if (urlLikeAttrs.has(normalizedAttr) && /^\s*javascript:/i.test(value)) {
            throw new Error(`[DomService] javascript: URLs are not allowed in attribute "${attr}".`);
        }
        if (normalizedAttr === "srcdoc" && /(?:javascript:|<script\b)/i.test(value)) {
            throw new Error(`[DomService] Potentially unsafe srcdoc value is not allowed.`);
        }
        this.RESOLVE(target)?.setAttribute(attr, value);
    };
    useRemoveAttribute = (target, attr) => {
        this.RESOLVE(target)?.removeAttribute(attr);
    };
    useGetDataAttribute = (target, key) => {
        return this.RESOLVE(target)?.dataset[key];
    };
    useSetDataAttribute = (target, key, value) => {
        const el = this.RESOLVE(target);
        if (el)
            el.dataset[key] = value;
    };
    useOn = (target, event, callback, options) => {
        if (!this.useIsBrowser())
            return null;
        const el = typeof target === "string" ? this.useQuerySelector(target) : target;
        if (!el)
            return null;
        const handler = callback;
        el.addEventListener(event, handler, options);
        return () => el.removeEventListener(event, handler, options);
    };
    useCreateElement = (tagName, options) => {
        if (!this.useIsBrowser()) {
            throw new Error("Cannot create elements in non-browser environment");
        }
        return document.createElement(tagName, options);
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
    useSetHtml = (target, html) => {
        const el = this.RESOLVE(target);
        if (el)
            el.innerHTML = html ?? "";
    };
    useSetText = (target, text) => {
        const el = this.RESOLVE(target);
        if (el)
            el.textContent = text;
    };
    useAppend = (target, child) => {
        const parent = this.RESOLVE(target);
        const childEl = this.RESOLVE(child);
        if (parent && childEl)
            parent.appendChild(childEl);
    };
    useRemove = (target) => {
        this.RESOLVE(target)?.remove();
    };
}
// Singleton instance and destructured exports.
export const DOM_SERVICE = DomService.getInstance();
export const { useIsBrowser, useGetRoot, useGetBody, useGetElementById, useGetElementByClass, useQuerySelector, useQuerySelectorAll, useAddClass, useRemoveClass, useToggleClass, useHasClass, useGetAttribute, useSetAttribute, useRemoveAttribute, useGetDataAttribute, useSetDataAttribute, useOn, useCreateElement, useSetHtml, useSetText, useAppend, useRemove, } = DOM_SERVICE;
//# sourceMappingURL=dom.service.js.map