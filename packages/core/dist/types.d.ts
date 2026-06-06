export type SwapStrategy = 'innerHTML' | 'outerHTML' | 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend';
export interface QutePlugin {
    init?: (element: HTMLElement, config: SourceConfig) => void;
    swap?: (oldEl: Element, newEl: Element, mode?: SwapStrategy) => Element;
    invalidate?: (url?: string) => void;
}
export interface QuteBeforeDetail {
    /** The element that triggered the transition */
    trigger: HTMLElement;
    /** The URL that will be fetched */
    url: string;
    /** Each planned swap: its config and the current element that will be replaced */
    swaps: Array<{
        config: TargetConfig;
        element: Element;
    }>;
}
export interface QuteAfterDetail {
    /** The element that triggered the transition */
    trigger: HTMLElement;
    /** The URL that was fetched */
    url: string;
    /** Each completed swap: its config, the new element, and the element it replaced */
    swaps: Array<{
        config: TargetConfig;
        element: Element;
        previousElement: Element;
    }>;
}
export interface QuteErrorDetail {
    trigger: HTMLElement;
    url: string;
    error: unknown;
}
export interface TargetConfig {
    /** CSS selector for the element to swap content into */
    replace: string;
    /** CSS selector(s) applied to the fetched response document to pick the fragment. When an array, the first selector that matches is used. Defaults to `replace` if omitted. */
    with?: string | string[];
    /** Optional guard: receives the current element and the incoming fragment. Swap and transition are skipped if it returns false. */
    if?: (oldElement: Element, newElement: Element) => boolean;
    /** Plugin to use for this swap, overrides any global plugin set via qute.use() */
    plugin?: QutePlugin;
    mode?: SwapStrategy;
    transitions?: string[];
}
export interface SourceConfig {
    /** CSS selector for trigger elements (e.g. links, forms) */
    target: string;
    /** Event(s) to listen for. Defaults to 'submit' for <form>, 'click' for everything else */
    trigger?: string | string[];
    swaps: TargetConfig[];
    /** How to update the browser history after a swap. 'push' adds a new entry, 'replace' updates the current one */
    history?: 'push' | 'replace';
    /** Call plugin.invalidate() after swaps complete. Pass a URL string to target only that page, or true to clear everything. */
    bustCache?: string | boolean;
}
//# sourceMappingURL=types.d.ts.map