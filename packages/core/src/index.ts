import type { SourceConfig } from "./types.js";
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

async function handleEvent(
  event: Event,
  el: HTMLElement,
  config: SourceConfig,
): Promise<void> {
  const info = getRequestInfo(el, event);
  if (!info?.url) return;

  event.preventDefault();

  const response = await fetch(info.url, info.init);
  const html = await response.text();
  const doc = new DOMParser().parseFromString(html, "text/html");

  const pairs = config.swaps.flatMap((target) => {
    const targetEl = document.querySelector(target.source);
    const fragment = doc.querySelector(target.target);
    return targetEl && fragment ? [{ targetEl, fragment, target }] : [];
  });

  if (pairs.length === 0) return;

  const types = [...new Set(pairs.flatMap(({ target }) => target.transitions ?? []))];

  startTransition(
    () => pairs.forEach(({ targetEl, fragment, target }) => swap(targetEl, fragment, target.mode)),
    types.length ? types : undefined,
  );
}

function defaultTrigger(el: HTMLElement): string {
  return el instanceof HTMLFormElement ? "submit" : "click";
}

const registered = new WeakMap<HTMLElement, Set<SourceConfig>>();
const configs: SourceConfig[] = [];

function attach(el: HTMLElement, config: SourceConfig): void {
  const set = registered.get(el) ?? new Set();
  if (set.has(config)) return;
  set.add(config);
  registered.set(el, set);
  const trigger = config.trigger ?? defaultTrigger(el);
  el.addEventListener(trigger, (event) => handleEvent(event, el, config));
}

function scan(root: Document | HTMLElement, config: SourceConfig): void {
  console.log(root.querySelectorAll<HTMLElement>(config.source));
  for (const el of root.querySelectorAll<HTMLElement>(config.source)) {
    attach(el, config);
  }
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (!(node instanceof HTMLElement)) continue;
      for (const config of configs) {
        if (node.matches(config.source)) attach(node, config);
        for (const match of node.querySelectorAll<HTMLElement>(config.source)) {
          attach(match, config);
        }
      }
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });

export const qute = {
  register(config: SourceConfig): void {
    configs.push(config);
    scan(document, config);
  },
};

export type { SourceConfig, TargetConfig, SwapStrategy } from "./types.js";
