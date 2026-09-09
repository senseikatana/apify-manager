/**
 * Checks whether the code is running in a browser environment.
 *
 * @returns `true` if both `window` and `document` are defined.
 *
 * @example
 * ```ts
 * if (useIsBrowser()) {
 *   // safe to access DOM APIs
 * }
 * ```
 */
export declare const useIsBrowser: () => boolean;
/**
 * Returns the root `<html>` element, or `null` outside a browser.
 *
 * @returns The `document.documentElement` element.
 *
 * @example
 * ```ts
 * const root = useGetRoot();
 * root?.setAttribute("lang", "en");
 * ```
 */
export declare const useGetRoot: () => HTMLElement | null;
/**
 * Returns the `<body>` element, or `null` outside a browser.
 *
 * @returns The `document.body` element cast as `HTMLBodyElement`.
 *
 * @example
 * ```ts
 * const body = useGetBody();
 * body?.classList.add("loaded");
 * ```
 */
export declare const useGetBody: () => HTMLBodyElement | null;
/**
 * Finds an element by its `id` attribute.
 *
 * @typeParam T - The expected HTMLElement subtype.
 * @param id - The element id (without `#`).
 * @returns The matching element, or `null`.
 *
 * @example
 * ```ts
 * const btn = useGetElementById<HTMLButtonElement>("submit-btn");
 * ```
 */
export declare const useGetElementById: <T extends HTMLElement = HTMLElement>(id: string) => T | null;
/**
 * Finds the first element matching a class name.
 *
 * @typeParam T - The expected HTMLElement subtype.
 * @param className - A class name, with or without a leading `.`.
 * @returns The matching element, or `null`.
 *
 * @example
 * ```ts
 * const card = useGetElementByClass(".card");
 * const card2 = useGetElementByClass("card"); // equivalent
 * ```
 */
export declare const useGetElementByClass: <T extends HTMLElement = HTMLElement>(className: string) => T | null;
/**
 * Returns the first element matching a CSS selector.
 *
 * @typeParam E - The expected Element subtype.
 * @param selector - A CSS selector string.
 * @returns The matching element, or `null`.
 *
 * @example
 * ```ts
 * const el = useQuerySelector<HTMLElement>(".my-class");
 * ```
 */
export declare const useQuerySelector: {
    <K extends keyof HTMLElementTagNameMap>(selector: K): HTMLElementTagNameMap[K] | null;
    <E extends Element = HTMLElement>(selector: string): E | null;
};
/**
 * Returns all elements matching a CSS selector.
 *
 * @typeParam E - The expected Element subtype.
 * @param selector - A CSS selector string.
 * @returns An array of matching elements.
 *
 * @example
 * ```ts
 * const items = useQuerySelectorAll<HTMLLIElement>("li.item");
 * items.forEach(el => console.log(el.textContent));
 * ```
 */
export declare const useQuerySelectorAll: {
    <K extends keyof HTMLElementTagNameMap>(selector: K): HTMLElementTagNameMap[K][];
    <E extends Element = HTMLElement>(selector: string): E[];
};
/**
 * Adds one or more CSS classes to the target element.
 *
 * @param target - A CSS selector string or an Element instance.
 * @param className - The class name to add.
 *
 * @example
 * ```ts
 * useAddClass("#header", "sticky");
 * useAddClass(myElement, "visible");
 * ```
 */
export declare const useAddClass: (target: Element | string, className: string) => void;
/**
 * Removes CSS class(es) from the target element.
 *
 * @param target - A CSS selector string or an Element instance.
 * @param className - A single class name or an array of class names to remove.
 *
 * @example
 * ```ts
 * useRemoveClass("#header", "sticky");
 * useRemoveClass(myElement, ["visible", "active"]);
 * ```
 */
export declare const useRemoveClass: (target: Element | string, className: string | string[]) => void;
/**
 * Toggles a CSS class on the target element.
 *
 * @param target - A CSS selector string or an Element instance.
 * @param className - The class name to toggle.
 * @param force - If provided, forces the class on (`true`) or off (`false`).
 * @returns `true` if the class is now present, `false` if removed, or `undefined` if element not found.
 *
 * @example
 * ```ts
 * useToggleClass(".sidebar", "open");
 * useToggleClass(".sidebar", "hidden", false);
 * ```
 */
export declare const useToggleClass: (target: Element | string, className: string, force?: boolean) => boolean | undefined;
/**
 * Checks whether the target element has a given CSS class.
 *
 * @param target - A CSS selector string or an Element instance.
 * @param className - The class name to check.
 * @returns `true` if the class exists, `false` otherwise.
 *
 * @example
 * ```ts
 * if (useHasClass(".btn", "disabled")) {
 *   // button is disabled
 * }
 * ```
 */
export declare const useHasClass: (target: Element | string, className: string) => boolean;
/**
 * Gets the value of an attribute from the target element.
 *
 * @param target - A CSS selector string or an Element instance.
 * @param attr - The attribute name.
 * @returns The attribute value, or `null` if not present or element not found.
 *
 * @example
 * ```ts
 * const href = useGetAttribute("a.link", "href");
 * ```
 */
export declare const useGetAttribute: (target: Element | string, attr: string) => string | null;
/**
 * Sets an attribute on the target element with XSS protection.
 * Blocks event-handler attributes (`on*`) and `javascript:` URLs.
 *
 * @param target - A CSS selector string or an Element instance.
 * @param attr - The attribute name.
 * @param value - The value to set.
 * @throws {Error} If the attribute is an event handler or contains a `javascript:` URL.
 *
 * @example
 * ```ts
 * useSetAttribute("img.hero", "src", "/photo.jpg");
 * useSetAttribute("a.link", "href", "https://example.com");
 * ```
 */
export declare const useSetAttribute: (target: Element | string, attr: string, value: string) => void;
/**
 * Removes an attribute from the target element.
 *
 * @param target - A CSS selector string or an Element instance.
 * @param attr - The attribute name to remove.
 *
 * @example
 * ```ts
 * useRemoveAttribute("input", "disabled");
 * ```
 */
export declare const useRemoveAttribute: (target: Element | string, attr: string) => void;
/**
 * Gets a `data-*` attribute value from the target element.
 *
 * @param target - A CSS selector string or an HTMLElement instance.
 * @param key - The data key (without the `data-` prefix).
 * @returns The data attribute value, or `undefined`.
 *
 * @example
 * ```ts
 * const id = useGetDataAttribute("tr.row", "userId");
 * ```
 */
export declare const useGetDataAttribute: (target: HTMLElement | string, key: string) => string | undefined;
/**
 * Sets a `data-*` attribute on the target element.
 *
 * @param target - A CSS selector string or an HTMLElement instance.
 * @param key - The data key (without the `data-` prefix).
 * @param value - The value to set.
 *
 * @example
 * ```ts
 * useSetDataAttribute("tr.row", "status", "active");
 * ```
 */
export declare const useSetDataAttribute: (target: HTMLElement | string, key: string, value: string) => void;
/**
 * Attaches an event listener to the target element and returns a cleanup function.
 *
 * @typeParam K - The event type key from `HTMLElementEventMap`.
 * @param target - An EventTarget instance or a CSS selector string.
 * @param event - The event name to listen for.
 * @param callback - The event handler.
 * @param options - Optional `addEventListener` options.
 * @returns A function that removes the listener, or `null` if not in a browser.
 *
 * @example
 * ```ts
 * const off = useOn("#btn", "click", (e) => console.log("clicked", e));
 * // later:
 * off?.();
 * ```
 */
export declare const useOn: <K extends keyof HTMLElementEventMap>(target: EventTarget | string, event: K, callback: (event: HTMLElementEventMap[K]) => void, options?: boolean | AddEventListenerOptions) => (() => void) | null;
/**
 * Creates a new HTML element.
 *
 * @typeParam T - The tag name from `HTMLElementTagNameMap`.
 * @param tagName - The tag name to create.
 * @param options - Optional element creation options.
 * @returns The newly created element.
 * @throws {Error} If called outside a browser environment.
 *
 * @example
 * ```ts
 * const div = useCreateElement("div");
 * const input = useCreateElement("input", { is: "custom-input" });
 * ```
 */
export declare const useCreateElement: <T extends keyof HTMLElementTagNameMap>(tagName: T, options?: ElementCreationOptions) => HTMLElementTagNameMap[T];
/**
 * Sets `innerHTML` on the target element.
 *
 * **XSS risk:** this is an HTML injection sink. Never pass unsanitized
 * user input. Prefer {@link useSetText} for plain text, or sanitize with
 * a trusted library (e.g. DOMPurify) before calling this function.
 *
 * @param target - A CSS selector string or an Element instance.
 * @param html - The HTML string to set.
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
export declare const useSetHtml: (target: Element | string, html: string) => void;
/**
 * Sets the `textContent` of the target element (safe for user input).
 *
 * @param target - A CSS selector string or an Element instance.
 * @param text - The plain text to set.
 *
 * @example
 * ```ts
 * useSetText("#greeting", "Hello, world!");
 * ```
 */
export declare const useSetText: (target: Element | string, text: string) => void;
/**
 * Appends a child element to the target parent.
 *
 * @param target - A CSS selector string or an Element instance (the parent).
 * @param child - A CSS selector string or an Element instance (the child).
 *
 * @example
 * ```ts
 * const item = useCreateElement("li");
 * useSetText(item, "New item");
 * useAppend("ul.list", item);
 * ```
 */
export declare const useAppend: (target: Element | string, child: Element | string) => void;
/**
 * Removes the target element from the DOM.
 *
 * @param target - A CSS selector string or an Element instance.
 *
 * @example
 * ```ts
 * useRemove(".modal-overlay");
 * ```
 */
export declare const useRemove: (target: Element | string) => void;
//# sourceMappingURL=dom.service.d.ts.map