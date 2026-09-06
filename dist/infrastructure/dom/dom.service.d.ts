import type { IDomService } from "../../types/index.js";
export declare class DomService implements IDomService {
    private static instance;
    private constructor();
    static getInstance(): DomService;
    useIsBrowser: () => boolean;
    useGetRoot: () => HTMLElement | null;
    useGetBody: () => HTMLBodyElement | null;
    private RESOLVE;
    useGetElementById: <T extends HTMLElement = HTMLElement>(id: string) => T | null;
    useGetElementByClass: <T extends HTMLElement = HTMLElement>(className: string) => T | null;
    useQuerySelector: {
        <K extends keyof HTMLElementTagNameMap>(selector: K): HTMLElementTagNameMap[K] | null;
        <E extends Element = HTMLElement>(selector: string): E | null;
    };
    useQuerySelectorAll: {
        <K extends keyof HTMLElementTagNameMap>(selector: K): HTMLElementTagNameMap[K][];
        <E extends Element = HTMLElement>(selector: string): E[];
    };
    useAddClass: (target: Element | string, className: string) => void;
    useRemoveClass: (target: Element | string, className: string | string[]) => void;
    useToggleClass: (target: Element | string, className: string, force?: boolean) => boolean | undefined;
    useHasClass: (target: Element | string, className: string) => boolean;
    useGetAttribute: (target: Element | string, attr: string) => string | null;
    useSetAttribute: (target: Element | string, attr: string, value: string) => void;
    useRemoveAttribute: (target: Element | string, attr: string) => void;
    useGetDataAttribute: (target: HTMLElement | string, key: string) => string | undefined;
    useSetDataAttribute: (target: HTMLElement | string, key: string, value: string) => void;
    useOn: <K extends keyof HTMLElementEventMap>(target: EventTarget | string, event: K, callback: (event: HTMLElementEventMap[K]) => void, options?: boolean | AddEventListenerOptions) => (() => void) | null;
    useCreateElement: <T extends keyof HTMLElementTagNameMap>(tagName: T, options?: ElementCreationOptions) => HTMLElementTagNameMap[T];
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
    useSetHtml: (target: Element | string, html: string) => void;
    useSetText: (target: Element | string, text: string) => void;
    useAppend: (target: Element | string, child: Element | string) => void;
    useRemove: (target: Element | string) => void;
}
export declare const DOM_SERVICE: DomService;
export declare const useIsBrowser: () => boolean, useGetRoot: () => HTMLElement | null, useGetBody: () => HTMLBodyElement | null, useGetElementById: <T extends HTMLElement = HTMLElement>(id: string) => T | null, useGetElementByClass: <T extends HTMLElement = HTMLElement>(className: string) => T | null, useQuerySelector: {
    <K extends keyof HTMLElementTagNameMap>(selector: K): HTMLElementTagNameMap[K] | null;
    <E extends Element = HTMLElement>(selector: string): E | null;
}, useQuerySelectorAll: {
    <K extends keyof HTMLElementTagNameMap>(selector: K): HTMLElementTagNameMap[K][];
    <E extends Element = HTMLElement>(selector: string): E[];
}, useAddClass: (target: Element | string, className: string) => void, useRemoveClass: (target: Element | string, className: string | string[]) => void, useToggleClass: (target: Element | string, className: string, force?: boolean) => boolean | undefined, useHasClass: (target: Element | string, className: string) => boolean, useGetAttribute: (target: Element | string, attr: string) => string | null, useSetAttribute: (target: Element | string, attr: string, value: string) => void, useRemoveAttribute: (target: Element | string, attr: string) => void, useGetDataAttribute: (target: HTMLElement | string, key: string) => string | undefined, useSetDataAttribute: (target: HTMLElement | string, key: string, value: string) => void, useOn: <K extends keyof HTMLElementEventMap>(target: EventTarget | string, event: K, callback: (event: HTMLElementEventMap[K]) => void, options?: boolean | AddEventListenerOptions) => (() => void) | null, useCreateElement: <T extends keyof HTMLElementTagNameMap>(tagName: T, options?: ElementCreationOptions) => HTMLElementTagNameMap[T], useSetHtml: (target: Element | string, html: string) => void, useSetText: (target: Element | string, text: string) => void, useAppend: (target: Element | string, child: Element | string) => void, useRemove: (target: Element | string) => void;
//# sourceMappingURL=dom.service.d.ts.map