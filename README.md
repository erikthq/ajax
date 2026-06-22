# erikt/ajax

Partial page updates with native browser transitions - no framework, no build step required.

→ [Documentation](https://ajax.erikt.me)

- 🎬 View Transitions first — typed, CSS-driven animations on every swap
- 🌐 Backend-agnostic — server returns plain HTML, no custom format needed
- 🧩 Plugin system — middleware pipelines for request and swap phases
- 🔭 Auto-observing — one `register()` covers current and future DOM elements
- ⚡ Prefetching built in — preload on hover or viewport entry
- 🪄 Morph swapping — preserve DOM state across updates with Idiomorph

---

Most AJAX libraries treat page transitions as an afterthought. This one is built around the [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) from the ground up. Fetch a fragment, swap it in, animate the change — all in a handful of lines, with typed transitions that map directly to CSS.

**Works with what you already have.** No special server setup, no custom response format. The server returns ordinary HTML; the library picks out the fragments it needs and swaps them into place. Any backend works.

**Stays out of the way.** Configuration lives in JavaScript, not scattered across HTML attributes. A single `register()` call covers all matching elements — current and future — via a MutationObserver. There's nothing to wire up per-element.

**Extensible without friction.** Request and swap phases are middleware pipelines. Plugins hook in with `request` and `swap` functions that call `next()` to proceed. The same model works for built-in plugins (history, preload, morph, head sync) and custom ones — no special API to learn.
