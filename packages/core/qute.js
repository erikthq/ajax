// src/swap.ts
function executeScripts(root) {
  for (const script of root.querySelectorAll("script")) {
    const next = document.createElement("script");
    for (const { name, value } of script.attributes) {
      next.setAttribute(name, value);
    }
    next.textContent = script.textContent;
    script.replaceWith(next);
  }
}
function swap(target, fragment, strategy = "innerHTML") {
  switch (strategy) {
    case "innerHTML":
      target.innerHTML = fragment.innerHTML;
      executeScripts(target);
      return target;
    case "outerHTML": {
      const marker = document.createComment("qute");
      target.before(marker);
      target.outerHTML = fragment.outerHTML;
      const newEl = marker.nextElementSibling;
      marker.remove();
      if (newEl) executeScripts(newEl);
      return newEl ?? target;
    }
    case "beforebegin":
    case "afterbegin":
    case "beforeend":
    case "afterend":
      target.insertAdjacentHTML(strategy, fragment.innerHTML);
      return target;
  }
}

// src/transition.ts
function startTransition(update, types) {
  if (!document.startViewTransition) {
    update();
    return Promise.resolve();
  }
  const vt = types?.length ? document.startViewTransition({ update, types }) : document.startViewTransition(update);
  return vt.updateCallbackDone;
}

// src/index.ts
function queryWith(doc, selector) {
  if (Array.isArray(selector)) {
    for (const s of selector) {
      const el = doc.querySelector(s);
      if (el) return el;
    }
    return null;
  }
  return doc.querySelector(selector);
}
function buildFormRequest(form, submitter) {
  const method = (submitter?.formMethod || form.method || "post").toUpperCase();
  const url = submitter?.hasAttribute("formaction") ? submitter.formAction : form.action;
  const methodAllowsBody = method !== "GET" && method !== "HEAD";
  return {
    url,
    init: {
      method,
      ...methodAllowsBody && { body: new FormData(form, submitter) }
    }
  };
}
function getRequestInfo(triggerElement, event) {
  if (triggerElement instanceof HTMLAnchorElement) {
    return { url: triggerElement.href };
  }
  if (triggerElement instanceof HTMLFormElement) {
    const submitter = event instanceof SubmitEvent ? event.submitter : null;
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
function dispatch(element, eventName, detail) {
  const dispatchTarget = element.isConnected ? element : document;
  dispatchTarget.dispatchEvent(
    new CustomEvent(eventName, { bubbles: true, detail })
  );
}
function resolveCurrentSwaps(swapConfigs) {
  return swapConfigs.flatMap((swapConfig) => {
    const element = document.querySelector(swapConfig.replace);
    return element ? [{ config: swapConfig, element }] : [];
  });
}
function resolveSwapEntries(swapConfigs, fetchedDocument) {
  return swapConfigs.flatMap((swapConfig) => {
    const oldElement = document.querySelector(swapConfig.replace);
    const fragment = queryWith(fetchedDocument, swapConfig.with ?? swapConfig.replace);
    return oldElement && fragment && (swapConfig.if?.(oldElement, fragment) ?? true) ? [{ swapConfig, oldElement, fragment, newElement: oldElement }] : [];
  });
}
async function fetchHTML(url, requestInit) {
  const response = await fetch(url, {
    ...requestInit,
    headers: { "X-Qute": "true", ...requestInit?.headers }
  });
  return response.text();
}
async function performSwaps(swapEntries) {
  const transitionTypes = [
    ...new Set(
      swapEntries.flatMap(({ swapConfig }) => swapConfig.transitions ?? [])
    )
  ];
  return startTransition(
    () => {
      for (const entry of swapEntries) {
        entry.newElement = resolveSwap(
          entry.oldElement,
          entry.fragment,
          entry.swapConfig
        );
      }
    },
    transitionTypes.length ? transitionTypes : void 0
  ).catch(() => {
  });
}
function attachConfigsToNewElements(swapEntries) {
  for (const { newElement } of swapEntries) {
    if (!(newElement instanceof HTMLElement)) continue;
    for (const registeredConfig of registeredConfigs) {
      if (newElement.matches(registeredConfig.target)) {
        attach(newElement, registeredConfig);
      }
      for (const childMatch of newElement.querySelectorAll(
        registeredConfig.target
      )) {
        attach(childMatch, registeredConfig);
      }
    }
  }
}
function serializableSwaps(swaps) {
  return swaps.map(({ replace, with: w, mode, transitions }) => ({
    replace,
    with: w,
    mode,
    transitions
  }));
}
function updateHistory(config, url) {
  const swaps = serializableSwaps(config.swaps);
  if (config.history === "push") {
    history.pushState({ __qute: true, swaps }, "", url);
  } else if (config.history === "replace") {
    history.replaceState({ __qute: true, swaps }, "", url);
  }
}
async function handleEvent(event, triggerElement, config) {
  const requestInfo = getRequestInfo(triggerElement, event);
  if (!requestInfo?.url) return;
  event.preventDefault();
  const currentSwaps = resolveCurrentSwaps(config.swaps);
  if (currentSwaps.length === 0) return;
  const ctx = {
    trigger: triggerElement,
    url: requestInfo.url,
    swaps: currentSwaps
  };
  dispatch(triggerElement, "qute:before", ctx);
  let html;
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
      const url = typeof config.bustCache === "string" ? config.bustCache : void 0;
      globalPlugin?.invalidate?.(url);
    }
  }
  ctx.swaps = swapEntries.map(({ swapConfig, oldElement, newElement }) => ({
    config: swapConfig,
    element: newElement,
    previousElement: oldElement
  }));
  dispatch(triggerElement, "qute:after", ctx);
}
function getDefaultTriggerEvent(element) {
  return element instanceof HTMLFormElement ? "submit" : "click";
}
var globalPlugin;
function resolveSwap(oldEl, newEl, swapConfig) {
  const plugin = swapConfig.plugin ?? globalPlugin;
  return plugin?.swap ? plugin.swap(oldEl, newEl, swapConfig.mode) : swap(oldEl, newEl, swapConfig.mode);
}
var attachedElements = /* @__PURE__ */ new WeakMap();
var registeredConfigs = [];
function getConfigKey(config) {
  const triggerKey = Array.isArray(config.trigger) ? config.trigger.join(",") : config.trigger ?? "";
  return `${config.target}\0${triggerKey}`;
}
function isAlreadyAttached(element, config) {
  const key = getConfigKey(config);
  const attachedKeys = attachedElements.get(element) ?? /* @__PURE__ */ new Set();
  if (attachedKeys.has(key)) return true;
  attachedKeys.add(key);
  attachedElements.set(element, attachedKeys);
  return false;
}
function getTriggerEvents(element, config) {
  if (!config.trigger) return [getDefaultTriggerEvent(element)];
  return Array.isArray(config.trigger) ? config.trigger : [config.trigger];
}
function attach(element, config) {
  if (isAlreadyAttached(element, config)) return;
  for (const triggerEvent of getTriggerEvents(element, config)) {
    element.addEventListener(triggerEvent, (event) => {
      const currentConfig = registeredConfigs.find(
        (c) => c.target === config.target && c.trigger === config.trigger
      );
      if (currentConfig) handleEvent(event, element, currentConfig);
    });
  }
  globalPlugin?.init?.(element, config);
}
function scanAndAttach(root, config) {
  for (const element of root.querySelectorAll(config.target)) {
    attach(element, config);
  }
}
var domObserver = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const addedNode of mutation.addedNodes) {
      if (!(addedNode instanceof HTMLElement)) continue;
      for (const config of registeredConfigs) {
        if (addedNode.matches(config.target)) attach(addedNode, config);
        for (const childMatch of addedNode.querySelectorAll(
          config.target
        )) {
          attach(childMatch, config);
        }
      }
    }
  }
});
domObserver.observe(document.body, { childList: true, subtree: true });
async function handlePopstate(event) {
  const state = event.state;
  if (!state?.__qute) {
    location.reload();
    return;
  }
  const html = await fetchHTML(location.href);
  const fetchedDocument = new DOMParser().parseFromString(html, "text/html");
  const swapEntries = (state.swaps ?? []).flatMap((swapConfig) => {
    const targetElement = document.querySelector(swapConfig.replace);
    const fragment = queryWith(fetchedDocument, swapConfig.with ?? swapConfig.replace);
    return targetElement && fragment && (swapConfig.if?.(targetElement, fragment) ?? true) ? [{ targetElement, fragment, swapConfig }] : [];
  });
  if (swapEntries.length === 0) {
    location.reload();
    return;
  }
  const transitionTypes = [
    ...new Set(
      swapEntries.flatMap(({ swapConfig }) => swapConfig.transitions ?? [])
    )
  ];
  startTransition(
    () => {
      for (const { targetElement, fragment, swapConfig } of swapEntries) {
        resolveSwap(targetElement, fragment, swapConfig);
      }
    },
    transitionTypes.length ? transitionTypes : void 0
  );
}
window.addEventListener("popstate", handlePopstate);
var qute = {
  use(plugin) {
    globalPlugin = plugin;
  },
  register(config) {
    const existingIndex = registeredConfigs.findIndex(
      (existingConfig) => existingConfig.target === config.target && existingConfig.trigger === config.trigger
    );
    if (existingIndex >= 0) registeredConfigs.splice(existingIndex, 1);
    registeredConfigs.push(config);
    scanAndAttach(document, config);
  }
};
window.qute = qute;
export {
  qute
};
//# sourceMappingURL=qute.js.map
