import type { QutePlugin, SourceConfig } from "./types.js";
export declare const qute: {
    use(plugin: QutePlugin): void;
    register(config: SourceConfig): void;
};
declare global {
    interface Window {
        qute: typeof qute;
    }
}
export type { SourceConfig, TargetConfig, SwapStrategy, QutePlugin, QuteBeforeDetail, QuteAfterDetail, QuteErrorDetail, } from "./types.js";
//# sourceMappingURL=index.d.ts.map