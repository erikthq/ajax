import type { QutePlugin } from '@qute/core';
export type PreloadStrategy = 'prefetch' | 'prerender' | 'fetch';
export type IgnoreRule = string | RegExp | ((url: string) => boolean);
export interface PreloadOptions {
    /** How to load the URL. Pass an array to apply multiple strategies. Default: 'prefetch' */
    strategy?: PreloadStrategy | PreloadStrategy[];
    /** IntersectionObserver threshold. Default: 0 (any pixel visible) */
    threshold?: number;
    /** Skip preloading on slow connections and when Save-Data is on. Default: true */
    respectConnection?: boolean;
    /** Only preload links that push/replace history (i.e. actual page navigations). Default: true */
    onlyNavigations?: boolean;
    /** URLs to never preload. Strings are matched against the pathname. */
    ignore?: IgnoreRule | IgnoreRule[];
}
export declare function preloadPlugin(options?: PreloadOptions): QutePlugin;
//# sourceMappingURL=index.d.ts.map