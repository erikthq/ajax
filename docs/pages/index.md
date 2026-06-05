Qute is a lightweight hypermedia library built around the
[View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API).
It lets you declaratively fetch and swap page fragments with smooth, typed transitions —
no full page reloads, no virtual DOM.

Drop a single script tag on the page, register which elements trigger which swaps,
and Qute handles the rest: fetching, diffing, transitioning, and history management.

## Features

- Declarative fragment swaps via CSS selectors
- Native View Transitions API — no polyfills
- Named transition types for CSS-driven animations
- History push/replace support
- Plugin system for custom swap strategies and preloading
- No build step required for consumers

## Installation

Load directly from a CDN:

```html
<script type="module" src="https://esm.sh/gh/erikthalen/qute@v0.0.1-beta.2/qute.js"></script>
```

Or use an import map to reference it by name:

```html
<script type="importmap">
{
  "imports": {
    "@qute/core": "https://esm.sh/gh/erikthalen/qute@v0.0.1-beta.2/qute.js"
  }
}
</script>

<script type="module">
  import { qute } from "@qute/core"
</script>
```
