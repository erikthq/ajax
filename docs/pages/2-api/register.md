# register()

`ajax.register(config)` is the main API. Call it once per interaction type —
each call wires up event listeners and teaches Ajax what to fetch and swap.

## AjaxConfig

```ts
ajax.register({
  target: string,               // CSS selector for trigger elements
  trigger?: string | string[],  // event(s) to listen for (default: 'click' / 'submit')
  transitions?: string[],       // view transition type names for all swaps in this registration
  plugins?: Plugin[],           // per-registration plugins (override global plugins by key)
  prevent?: boolean,            // prevent default event (default: true)
  swaps: TargetConfig[],
})
```

## TargetConfig

```ts
const swaps = [{
  replace: string,                 // selector for the element to replace in the current page
  with?: string | string[],        // selector(s) in the fetched page — first match wins, defaults to replace
  mode?: SwapStrategy,             // 'innerHTML' | 'outerHTML' | 'beforebegin' | ... (default: 'innerHTML')
  if?: (current, next) => boolean, // guard — skip this swap if it returns false
}]
```

## Example

```js
import ajax, { history } from "@erikt/ajax"

ajax.register({
  target: "#link-about",
  transitions: ["slide-left"],
  plugins: [history("push")],
  swaps: [
    {
      replace: "#main",
      with: "#main",
      mode: "innerHTML",
    },
  ],
})
```

## Per-registration plugins

Plugins passed to `plugins` override any globally registered plugin with the
same `key`. This lets you change behaviour for a single registration without
affecting others:

```js
import ajax, { loading } from "@erikt/ajax"

ajax.use(loading())  // default: use the triggering element as the loading target

ajax.register({
  target: "#search-form",
  plugins: [loading("#search-spinner")],  // override: use a specific element instead
  swaps: [{ replace: "#results" }],
})
```
