The morph plugin replaces Qute's default DOM swap with
[Idiomorph](https://github.com/bigskysoftware/idiomorph),
which diffs the old and new DOM trees and applies minimal mutations.
This preserves element identity — existing nodes keep their focus state,
CSS transitions, and event listeners.

## Installation

```html
<script type="importmap">
{
  "imports": {
    "@qute/core": "https://esm.sh/gh/erikthalen/qute@0.0.4/qute.js",
    "@qute/morph": "https://esm.sh/gh/erikthalen/qute@0.0.4/morph.js",
    "idiomorph": "https://esm.sh/idiomorph@0.7.4"
  }
}
</script>
```

## Usage

### Global — all swaps use morph

Call `qute.use()` once before any `qute.register()` calls to apply morph to every swap:

```html
<nav id="nav">
  <a href="/" id="link-home">Home</a>
  <a href="/about" id="link-about">About</a>
</nav>

<main id="content">
  <h1>Home</h1>
  <p>Welcome.</p>
</main>

<script type="module">
  import { qute } from "@qute/core"
  import { morphPlugin } from "@qute/morph"

  qute.use(morphPlugin)

  qute.register({
    target: "a[href]",
    history: "push",
    swaps: [{ replace: "#content", transitions: ["fade"] }],
  })
</script>
```

### Per-swap — morph on specific swaps only

Omit `qute.use()` and set `plugin` on individual swap configs instead:

```html
<form id="search-form" action="/search">
  <input name="q" type="search" placeholder="Search…" />
  <button type="submit">Go</button>
</form>

<ul id="results">
  <li>Result A</li>
  <li>Result B</li>
</ul>

<script type="module">
  import { qute } from "@qute/core"
  import { morphPlugin } from "@qute/morph"

  qute.register({
    target: "#search-form",
    swaps: [
      {
        // morph the results list — preserves scroll position and item identity
        replace: "#results",
        plugin: morphPlugin,
      },
      {
        // replace the form normally — no need to morph static chrome
        replace: "#search-form",
      },
    ],
  })
</script>
```

### Preserving focus in live search

The main reason to use morph is when the user interacts with the page while
a swap is in flight. Without morph, swapping `#results` would destroy and
recreate every DOM node — a focused `<input>` loses focus, an in-progress
CSS animation resets, and scroll position jumps.

```html
<input id="filter" type="search" placeholder="Filter…" />

<ul id="list">
  <li>Item A</li>
  <li>Item B</li>
  <li>Item C</li>
</ul>

<script type="module">
  import { qute } from "@qute/core"
  import { morphPlugin } from "@qute/morph"

  qute.register({
    target: "#filter",
    trigger: "input",
    swaps: [
      {
        replace: "#list",
        plugin: morphPlugin, // input stays focused across swaps
      },
    ],
  })
</script>
```

### innerHTML vs outerHTML

The `mode` swap option maps to Idiomorph's `morphStyle`:

```js
swaps: [
  {
    replace: "#content",
    plugin: morphPlugin,
    mode: "innerHTML",  // diff children only, keep the root element in place
  },
]
```

Use `innerHTML` when the root element carries state you want to preserve
(scroll position, CSS animations). Use `outerHTML` (the default) when you
want the root element itself replaced if it changes.

## How it works

Idiomorph walks both trees simultaneously and patches only what changed —
text nodes, attributes, added/removed children. Elements that stay the same
are reused in place, so a focused `<input>` won't lose focus during a swap.
The `mode` option maps directly to Idiomorph's `morphStyle`:
`innerHTML` morphs children only, `outerHTML` (default) includes the root element.
