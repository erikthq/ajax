# morph

The morph plugin replaces Ajax's default DOM swap with
[Idiomorph](https://github.com/bigskysoftware/idiomorph),
which diffs the old and new DOM trees and applies minimal mutations.
This preserves element identity — existing nodes keep their focus state,
CSS transitions, and event listeners.

## Installation

`morph` is included in `@erikt/ajax`. It requires `idiomorph` as a peer dependency:

```html
<script type="importmap">
{
  "imports": {
    "@erikt/ajax": "https://esm.sh/@erikt/ajax",
    "idiomorph":   "https://esm.sh/idiomorph@0.7.4"
  }
}
</script>
```

If `idiomorph` is not installed, the morph plugin logs a warning and falls back
to the default swap.

## Usage

### Global — all swaps use morph

Call `ajax.use()` once before any `ajax.register()` calls to apply morph to every swap:

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
  import ajax, { morph, history } from "@erikt/ajax"

  ajax.use(morph)

  ajax.register({
    target: "a[href]",
    transitions: ["fade"],
    plugins: [history("push")],
    swaps: [{ replace: "#content" }],
  })
</script>
```

### Per-registration — morph on specific registrations only

Pass `morph` in the `plugins` array on a registration:

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
  import ajax, { morph } from "@erikt/ajax"

  ajax.register({
    target: "#search-form",
    plugins: [morph],
    swaps: [
      { replace: "#results" },
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
  import ajax, { morph } from "@erikt/ajax"

  ajax.register({
    target: "#filter",
    trigger: "input",
    plugins: [morph],
    swaps: [
      { replace: "#list" },
    ],
  })
</script>
```

## innerHTML vs outerHTML

The `mode` swap option maps to Idiomorph's `morphStyle`:

```js
ajax.register({
  target: "#filter",
  plugins: [morph],
  swaps: [
    {
      replace: "#content",
      mode: "innerHTML",  // diff children only, keep the root element in place
    },
  ],
})
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
