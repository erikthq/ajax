// src/index.ts
var store = /* @__PURE__ */ new Map();
var qute = {
  register(config) {
    const regs = store.get(config.target);
    if (regs?.has(config)) return;
    if (!regs) {
      store.set(config.target, /* @__PURE__ */ new Set([config]));
    } else {
      store.set(config.target, regs.add(config));
    }
    listen(config);
    console.log(store);
  }
};
function listen(config) {
  const elements = document.querySelectorAll(config.target);
  for (const element of elements) {
    if (element.dataset.ajax !== void 0) return;
    const triggers = [config.trigger ?? defaultTrigger(element)].flat();
    for (const trigger of triggers) {
      element.addEventListener(trigger, (e) => performSwap(e, config));
    }
  }
}
function defaultTrigger(element) {
  switch (element.tagName) {
    case "FORM":
      return "submit";
    default:
      return "click";
  }
}
async function performSwap(e, config) {
  if (config.prevent !== false) {
    e.preventDefault();
  }
  if (!e.target || !(e.target instanceof HTMLElement)) {
    console.log("[ajax] - No target");
    return;
  }
  const { name } = e.constructor;
  const el = e.target.closest(name === "SubmitEvent" ? "form" : "a");
  if (!el) {
    console.log("[ajax] - No closest <form> or <a>");
    return;
  }
  const url = el?.getAttribute("href") ?? el?.getAttribute("action");
  if (!url) {
    console.log("[ajax] - No url to fetch");
    return;
  }
  const response = await fetch(url);
  const html = new DOMParser().parseFromString(
    await response.text(),
    "text/html"
  );
  console.log(html);
}
export {
  qute
};
//# sourceMappingURL=qute.js.map
