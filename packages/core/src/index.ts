import type { QuteErrorDetail, QuteSwapDetail, SourceConfig, TargetConfig } from "./types.js";
import { swap } from "./swap.js";
import { startTransition } from "./transition.js";

function getRequestInfo(
  el: HTMLElement,
  event: Event,
): { url: string; init?: RequestInit } | null {
  if (el instanceof HTMLFormElement) {
    return {
      url: el.action,
      init: { method: el.method || "post", body: new FormData(el) },
    };
  }

  if (el instanceof HTMLAnchorElement) {
    return { url: el.href };
  }

  if (el instanceof HTMLButtonElement) {
    const url = el.hasAttribute("formaction")
      ? el.formAction
      : (el.closest("form")?.action ?? "");
    const form = el.closest("form");
    return {
      url,
      init: form
        ? { method: form.method || "post", body: new FormData(form) }
        : undefined,
    };
  }

  return null;
}

function dispatch<T>(el: Element, name: string, detail: T): void {
  el.dispatchEvent(new CustomEvent<T>(name, { bubbles: true, detail }));
}

async function handleEvent(
  event: Event,
  el: HTMLElement,
  config: SourceConfig,
): Promise<void> {
  const info = getRequestInfo(el, event);
  if (!info?.url) return;

  event.preventDefault();

  for (const swapConfig of config.swaps) {
    const oldEl = document.querySelector(swapConfig.replace);
    if (!oldEl) continue;
    const detail: QuteSwapDetail = { trigger: el, url: info.url, swap: swapConfig, element: oldEl };
    dispatch(el, "qute:before", detail);
    dispatch(oldEl, "qute:before", detail);
  }

  let html: string;
  try {
    const response = await fetch(info.url, info.init);
    html = await response.text();
  } catch (error) {
    dispatch(el, "qute:error", { trigger: el, url: info.url, error } satisfies QuteErrorDetail);
    return;
  }

  const doc = new DOMParser().parseFromString(html, "text/html");

  type SwapEntry = { swapConfig: TargetConfig; oldEl: Element; fragment: Element; newEl: Element };
  const entries: SwapEntry[] = config.swaps.flatMap((swapConfig) => {
    const oldEl = document.querySelector(swapConfig.replace);
    const fragment = doc.querySelector(swapConfig.with);
    return oldEl && fragment ? [{ swapConfig, oldEl, fragment, newEl: oldEl }] : [];
  });

  if (entries.length === 0) return;

  const types = [...new Set(entries.flatMap(({ swapConfig }) => swapConfig.transitions ?? []))];

  await startTransition(() => {
    for (const entry of entries) {
      entry.newEl = swap(entry.oldEl, entry.fragment, entry.swapConfig.mode);
    }
  }, types.length ? types : undefined);

  if (config.history === "push") {
    history.pushState({ __qute: true, swaps: config.swaps }, "", info.url);
  } else if (config.history === "replace") {
    history.replaceState({ __qute: true, swaps: config.swaps }, "", info.url);
  }

  for (const { swapConfig, oldEl, newEl } of entries) {
    const detail: QuteSwapDetail = { trigger: el, url: info.url, swap: swapConfig, element: newEl, previousElement: oldEl };
    dispatch(el, "qute:after", detail);
    dispatch(newEl, "qute:after", detail);
  }
}

function defaultTrigger(el: HTMLElement): string {
  return el instanceof HTMLFormElement ? "submit" : "click";
}

const registered = new WeakMap<HTMLElement, Set<string>>();
const configs: SourceConfig[] = [];

function configKey(config: SourceConfig): string {
  return `${config.target}\0${config.trigger ?? ""}`;
}

function attach(el: HTMLElement, config: SourceConfig): void {
  const key = configKey(config);
  const set = registered.get(el) ?? new Set<string>();
  if (set.has(key)) return;
  set.add(key);
  registered.set(el, set);
  const trigger = config.trigger ?? defaultTrigger(el);
  const { target, trigger: triggerName } = config;
  el.addEventListener(trigger, (event) => {
    const current = configs.find(
      (c) => c.target === target && c.trigger === triggerName,
    );
    if (current) handleEvent(event, el, current);
  });
}

function scan(root: Document | HTMLElement, config: SourceConfig): void {
  for (const el of root.querySelectorAll<HTMLElement>(config.target)) {
    attach(el, config);
  }
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (!(node instanceof HTMLElement)) continue;
      for (const config of configs) {
        if (node.matches(config.target)) attach(node, config);
        for (const match of node.querySelectorAll<HTMLElement>(config.target)) {
          attach(match, config);
        }
      }
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });

window.addEventListener("popstate", async (event) => {
  const state = event.state as { __qute?: boolean; swaps?: TargetConfig[] } | null;

  if (!state?.__qute) {
    location.reload();
    return;
  }

  const response = await fetch(location.href);
  const html = await response.text();
  const doc = new DOMParser().parseFromString(html, "text/html");

  const pairs = (state.swaps ?? []).flatMap((swapConfig) => {
    const targetEl = document.querySelector(swapConfig.replace);
    const fragment = doc.querySelector(swapConfig.with);
    return targetEl && fragment ? [{ targetEl, fragment, swapConfig }] : [];
  });

  if (pairs.length === 0) {
    location.reload();
    return;
  }

  const types = [...new Set(pairs.flatMap(({ swapConfig }) => swapConfig.transitions ?? []))];

  startTransition(() => {
    for (const { targetEl, fragment, swapConfig } of pairs) {
      swap(targetEl, fragment, swapConfig.mode);
    }
  }, types.length ? types : undefined);
});

export const qute = {
  register(config: SourceConfig): void {
    const idx = configs.findIndex(
      (c) => c.target === config.target && c.trigger === config.trigger,
    );
    if (idx >= 0) configs.splice(idx, 1);
    configs.push(config);
    scan(document, config);
  },
};

export type { SourceConfig, TargetConfig, SwapStrategy, QuteSwapDetail, QuteErrorDetail } from "./types.js";
