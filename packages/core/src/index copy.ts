import type {
  QuteContext,
  QutePlugin,
  SourceConfig,
  TargetConfig,
} from "./types.js";
import { swap } from "./swap.js";
import { startTransition } from "./transition.js";

type RequestInfo = { url: string; init?: RequestInit };

function queryWith(doc: Document, selector: string | string[]): Element | null {
  if (Array.isArray(selector)) {
    for (const s of selector) {
      const el = doc.querySelector(s);
      if (el) return el;
    }
    return null;
  }
  return doc.querySelector(selector);
}

function buildFormRequest(
  form: HTMLFormElement,
  submitter: HTMLButtonElement | null,
): RequestInfo {
  const method = (submitter?.formMethod || form.method || "post").toUpperCase();
  const url = submitter?.hasAttribute("formaction")
    ? submitter.formAction
    : form.action;
  const methodAllowsBody = method !== "GET" && method !== "HEAD";
  return {
    url,
    init: {
      method,
      ...(methodAllowsBody && { body: new FormData(form, submitter) }),
    },
  };
}

function getRequestInfo(
  triggerElement: HTMLElement,
  event?: Event,
): RequestInfo | null {
  if (triggerElement instanceof HTMLAnchorElement) {
    return { url: triggerElement.href };
  }

  if (triggerElement instanceof HTMLFormElement) {
    const submitter =
      event instanceof SubmitEvent
        ? (event.submitter as HTMLButtonElement | null)
        : null;
    return buildFormRequest(triggerElement, submitter);
  }

  if (triggerElement instanceof HTMLButtonElement) {
    const form = triggerElement.closest("form");
    if (!form) {
      return { url: triggerElement.formAction };
    }
    return buildFormRequest(form, triggerElement);
  }

  return null;
}

function dispatch<T>(element: Element, eventName: string, detail: T): void {
  const dispatchTarget = element.isConnected ? element : document;
  dispatchTarget.dispatchEvent(
    new CustomEvent<T>(eventName, { bubbles: true, detail }),
  );
}

type SwapEntry = {
  swapConfig: TargetConfig;
  oldElement: Element;
  fragment: Element;
  newElement: Element;
};

function resolveCurrentSwaps(
  swapConfigs: TargetConfig[],
): Array<{ config: TargetConfig; element: Element }> {
  return swapConfigs.flatMap((swapConfig) => {
    const element = document.querySelector(swapConfig.replace);
    return element ? [{ config: swapConfig, element }] : [];
  });
}

function resolveSwapEntries(
  swapConfigs: TargetConfig[],
  fetchedDocument: Document,
): SwapEntry[] {
  return swapConfigs.flatMap((swapConfig) => {
    const oldElement = document.querySelector(swapConfig.replace);
    const fragment = queryWith(fetchedDocument, swapConfig.with ?? swapConfig.replace);
    return oldElement && fragment && (swapConfig.if?.(oldElement, fragment) ?? true)
      ? [{ swapConfig, oldElement, fragment, newElement: oldElement }]
      : [];
  });
}

async function fetchHTML(
  url: string,
  requestInit?: RequestInit,
): Promise<string> {
  const response = await fetch(url, {
    ...requestInit,
    headers: { "X-Qute": "true", ...requestInit?.headers },
  });
  return response.text();
}

async function performSwaps(swapEntries: SwapEntry[]): Promise<void> {
  const transitionTypes = [
    ...new Set(
      swapEntries.flatMap(({ swapConfig }) => swapConfig.transitions ?? []),
    ),
  ];
  return startTransition(
    () => {
      for (const entry of swapEntries) {
        entry.newElement = resolveSwap(
          entry.oldElement,
          entry.fragment,
          entry.swapConfig,
        );
      }
    },
    transitionTypes.length ? transitionTypes : undefined,
  ).catch(() => {});
}

function attachConfigsToNewElements(swapEntries: SwapEntry[]): void {
  for (const { newElement } of swapEntries) {
    if (!(newElement instanceof HTMLElement)) continue;

    for (const registeredConfig of registeredConfigs) {
      if (newElement.matches(registeredConfig.target)) {
        attach(newElement, registeredConfig);
      }

      for (const childMatch of newElement.querySelectorAll<HTMLElement>(
        registeredConfig.target,
      )) {
        attach(childMatch, registeredConfig);
      }
    }
  }
}

function serializableSwaps(swaps: TargetConfig[]) {
  return swaps.map(({ replace, with: w, mode, transitions }) => ({
    replace,
    with: w,
    mode,
    transitions,
  }));
}

function updateHistory(config: SourceConfig, url: string): void {
  const swaps = serializableSwaps(config.swaps);
  if (config.history === "push") {
    history.pushState({ __qute: true, swaps }, "", url);
  } else if (config.history === "replace") {
    history.replaceState({ __qute: true, swaps }, "", url);
  }
}

async function handleEvent(
  event: Event,
  triggerElement: HTMLElement,
  config: SourceConfig,
): Promise<void> {
  const requestInfo = getRequestInfo(triggerElement, event);

  if (!requestInfo?.url) return;

  event.preventDefault();

  const currentSwaps = resolveCurrentSwaps(config.swaps);

  if (currentSwaps.length === 0) return;

  const ctx: QuteContext = {
    trigger: triggerElement,
    url: requestInfo.url,
    swaps: currentSwaps,
  };

  dispatch(triggerElement, "qute:before", ctx);

  let html: string;

  try {
    html = await fetchHTML(requestInfo.url, requestInfo.init);
  } catch (error) {
    ctx.error = error;
    dispatch(triggerElement, "qute:error", ctx);
    return;
  }

  const fetchedDocument = new DOMParser().parseFromString(html, "text/html");
  const swapEntries = resolveSwapEntries(config.swaps, fetchedDocument);

  if (swapEntries.length > 0) {
    await performSwaps(swapEntries);
    attachConfigsToNewElements(swapEntries);
    updateHistory(config, requestInfo.url);
    if (config.bustCache) {
      const url = typeof config.bustCache === "string" ? config.bustCache : undefined;
      globalPlugin?.invalidate?.(url);
    }
  }

  ctx.swaps = swapEntries.map(({ swapConfig, oldElement, newElement }) => ({
    config: swapConfig,
    element: newElement,
    previousElement: oldElement,
  }));

  dispatch(triggerElement, "qute:after", ctx);
}

function getDefaultTriggerEvent(element: HTMLElement): string {
  return element instanceof HTMLFormElement ? "submit" : "click";
}

let globalPlugin: QutePlugin | undefined;

function resolveSwap(
  oldEl: Element,
  newEl: Element,
  swapConfig: TargetConfig,
): Element {
  const plugin = swapConfig.plugin ?? globalPlugin;
  return plugin?.swap
    ? plugin.swap(oldEl, newEl, swapConfig.mode)
    : swap(oldEl, newEl, swapConfig.mode);
}

const attachedElements = new WeakMap<HTMLElement, Set<string>>();
const registeredConfigs: SourceConfig[] = [];

function getConfigKey(config: SourceConfig): string {
  const triggerKey = Array.isArray(config.trigger)
    ? config.trigger.join(",")
    : (config.trigger ?? "");
  return `${config.target}\0${triggerKey}`;
}

function isAlreadyAttached(
  element: HTMLElement,
  config: SourceConfig,
): boolean {
  const key = getConfigKey(config);
  const attachedKeys = attachedElements.get(element) ?? new Set<string>();
  if (attachedKeys.has(key)) return true;
  attachedKeys.add(key);
  attachedElements.set(element, attachedKeys);
  return false;
}

function getTriggerEvents(
  element: HTMLElement,
  config: SourceConfig,
): string[] {
  if (!config.trigger) return [getDefaultTriggerEvent(element)];
  return Array.isArray(config.trigger) ? config.trigger : [config.trigger];
}

function attach(element: HTMLElement, config: SourceConfig): void {
  if (isAlreadyAttached(element, config)) return;

  for (const triggerEvent of getTriggerEvents(element, config)) {
    element.addEventListener(triggerEvent, (event) => {
      const currentConfig = registeredConfigs.find(
        (c) => c.target === config.target && c.trigger === config.trigger,
      );
      if (currentConfig) handleEvent(event, element, currentConfig);
    });
  }

  globalPlugin?.init?.(element, config);
}

function scanAndAttach(
  root: Document | HTMLElement,
  config: SourceConfig,
): void {
  for (const element of root.querySelectorAll<HTMLElement>(config.target)) {
    attach(element, config);
  }
}

const domObserver = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const addedNode of mutation.addedNodes) {
      if (!(addedNode instanceof HTMLElement)) continue;
      for (const config of registeredConfigs) {
        if (addedNode.matches(config.target)) attach(addedNode, config);
        for (const childMatch of addedNode.querySelectorAll<HTMLElement>(
          config.target,
        )) {
          attach(childMatch, config);
        }
      }
    }
  }
});

domObserver.observe(document.body, { childList: true, subtree: true });

async function handlePopstate(event: PopStateEvent): Promise<void> {
  const state = event.state as {
    __qute?: boolean;
    swaps?: TargetConfig[];
  } | null;

  if (!state?.__qute) {
    location.reload();
    return;
  }

  const html = await fetchHTML(location.href);
  const fetchedDocument = new DOMParser().parseFromString(html, "text/html");

  const swapEntries = (state.swaps ?? []).flatMap((swapConfig) => {
    const targetElement = document.querySelector(swapConfig.replace);
    const fragment = queryWith(fetchedDocument, swapConfig.with ?? swapConfig.replace);
    return targetElement && fragment && (swapConfig.if?.(targetElement, fragment) ?? true)
      ? [{ targetElement, fragment, swapConfig }]
      : [];
  });

  if (swapEntries.length === 0) {
    location.reload();
    return;
  }

  const transitionTypes = [
    ...new Set(
      swapEntries.flatMap(({ swapConfig }) => swapConfig.transitions ?? []),
    ),
  ];

  startTransition(
    () => {
      for (const { targetElement, fragment, swapConfig } of swapEntries) {
        resolveSwap(targetElement, fragment, swapConfig);
      }
    },
    transitionTypes.length ? transitionTypes : undefined,
  );
}

window.addEventListener("popstate", handlePopstate);

export const qute = {
  use(plugin: QutePlugin): void {
    globalPlugin = plugin;
  },
  register(config: SourceConfig): void {
    const existingIndex = registeredConfigs.findIndex(
      (existingConfig) =>
        existingConfig.target === config.target &&
        existingConfig.trigger === config.trigger,
    );
    if (existingIndex >= 0) registeredConfigs.splice(existingIndex, 1);
    registeredConfigs.push(config);
    scanAndAttach(document, config);
  },
};

declare global {
  interface Window {
    qute: typeof qute;
  }
}

window.qute = qute;

export type {
  SourceConfig,
  TargetConfig,
  SwapStrategy,
  QutePlugin,
  QuteContext,
} from "./types.js";
