# history

The history plugin calls `pushState` or `replaceState` after a swap completes,
keeping the browser URL in sync with the fetched page.

## Usage

Pass `"push"` to add a new history entry, or `"replace"` to overwrite the
current one:

```js
import ajax, { history } from "@erikt/ajax"

ajax.register({
  target: "nav a",
  plugins: [history("push")],
  swaps: [{ replace: "#main" }],
})
```

Use `"replace"` when navigating does not represent a distinct step the user
should be able to back out of — for example, a tab switch or an inline filter:

```js
ajax.register({
  target: "#tabs a",
  plugins: [history("replace")],
  swaps: [{ replace: "#tab-content" }],
})
```

## Keeping the URL unchanged

Pass `false` as the second argument to call `pushState`/`replaceState` without
changing the URL. This still creates a history entry (or overwrites it) but
the address bar does not update:

```js
ajax.register({
  target: "#modal-trigger",
  plugins: [history("push", false)],
  swaps: [{ replace: "#modal" }],
})
```

## Options

| Argument | Type | Default | Description |
|---|---|---|---|
| `mode` | `"push" \| "replace"` | — | Whether to push a new entry or replace the current one |
| `updateUrl` | `boolean` | `true` | Whether to update the address bar URL |
