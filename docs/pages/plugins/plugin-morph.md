The morph plugin replaces Qute's default DOM swap with
[Idiomorph](https://github.com/bigskysoftware/idiomorph),
which diffs the old and new DOM trees and applies minimal mutations.
This preserves element identity — existing nodes keep their focus state,
CSS transitions, and event listeners.

## Installation

```bash
npm install @qute/morph
```

Idiomorph is a peer dependency — install it alongside:

```bash
npm install idiomorph
```

## Usage

```js
import { morphPlugin } from '@qute/morph'

// global — all swaps use morph
qute.use(morphPlugin)

// or per-swap
swaps: [{ replace: '#content', plugin: morphPlugin }]
```

## Import map (no bundler)

When loading from a CDN, map the `idiomorph` specifier before any module scripts:

```html
<script type="importmap">
  { "imports": { "idiomorph": "https://esm.sh/idiomorph@0.7.4" } }
</script>
```

## How it works

Idiomorph walks both trees simultaneously and patches only what changed —
text nodes, attributes, added/removed children. Elements that stay the same
are reused in place, so a focused `<input>` won't lose focus during a swap.
The `mode` option maps directly to Idiomorph's `morphStyle`:
`innerHTML` morphs children only, `outerHTML` (default) includes the root element.
