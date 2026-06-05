// src/index.ts
var idle = typeof requestIdleCallback !== "undefined" ? (cb) => requestIdleCallback(cb) : (cb) => setTimeout(cb, 0);
function isSlow() {
  const conn = navigator.connection;
  if (!conn) return false;
  if (conn.saveData) return true;
  return /2g/.test(conn.effectiveType ?? "");
}
function supportsSpeculationRules() {
  return typeof HTMLScriptElement !== "undefined" && typeof HTMLScriptElement.supports === "function" && HTMLScriptElement.supports("speculationrules");
}
function resolveURL(url) {
  try {
    return new URL(url, location.href).href;
  } catch {
    return url;
  }
}
function linkURL(element) {
  return element instanceof HTMLAnchorElement ? element.href : null;
}
function isNavigation(config) {
  return config.history === "push" || config.history === "replace";
}
function isIgnored(url, rules) {
  const { pathname } = new URL(url);
  return rules.some((rule) => {
    if (typeof rule === "string") return pathname === rule;
    if (rule instanceof RegExp) return rule.test(url);
    return rule(url);
  });
}
function preloadPlugin(options = {}) {
  const {
    strategy = "prefetch",
    threshold = 0,
    respectConnection = true,
    onlyNavigations = true,
    ignore = []
  } = options;
  const ignoreRules = Array.isArray(ignore) ? ignore : [ignore];
  const strategies = Array.isArray(strategy) ? strategy : [strategy];
  const handled = /* @__PURE__ */ new Set();
  const injected = [];
  function applyStrategy(url, s) {
    const key = `${s}:${url}`;
    if (handled.has(key)) return;
    handled.add(key);
    switch (s) {
      case "prefetch": {
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = url;
        document.head.appendChild(link);
        injected.push({ url, el: link });
        break;
      }
      case "prerender": {
        if (!supportsSpeculationRules()) {
          applyStrategy(url, "prefetch");
          return;
        }
        const script = document.createElement("script");
        script.type = "speculationrules";
        script.textContent = JSON.stringify({
          prerender: [{ source: "list", urls: [url] }]
        });
        document.head.appendChild(script);
        injected.push({ url, el: script });
        break;
      }
      case "fetch": {
        fetch(url, { priority: "low" }).catch(() => {
        });
        break;
      }
    }
  }
  function invalidate(url) {
    const target = url ? resolveURL(url) : void 0;
    const remove = target ? injected.filter((e) => e.url === target) : injected.slice();
    for (const { url: u, el } of remove) {
      el.remove();
      for (const s of strategies) handled.delete(`${s}:${u}`);
    }
    if (target) {
      injected.splice(0, injected.length, ...injected.filter((e) => e.url !== target));
      fetch(target, {
        cache: "reload",
        headers: { "X-Qute-Invalidate": "1" }
      }).catch(() => {
      });
    } else {
      injected.length = 0;
      handled.clear();
    }
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const url = linkURL(entry.target);
        if (!url) continue;
        idle(() => {
          if (respectConnection && isSlow()) return;
          if (isIgnored(url, ignoreRules)) return;
          for (const s of strategies) applyStrategy(url, s);
        });
      }
    },
    { threshold }
  );
  return {
    init(element, config) {
      if (onlyNavigations && !isNavigation(config)) return;
      if (!linkURL(element)) return;
      observer.observe(element);
    },
    invalidate
  };
}
export {
  preloadPlugin
};
//# sourceMappingURL=preload.js.map
