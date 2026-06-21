# Plugins

Plugins extend Ajax's request and swap lifecycle. A plugin is a plain object
with optional hooks, registered globally via `ajax.use()` or per-registration
via the `plugins` array on `ajax.register()`.

## Plugin interface

```ts
type Plugin = {
  key?: string    // optional identifier — per-registration plugins with the same key
                  // override the global plugin of the same key

  // Called once when an element is matched and attached to a registration
  attach?: (element: HTMLElement, config: AjaxConfig) => void

  // Wraps the fetch. Call next() to continue. Modify ctx.headers or ctx.body here.
  request?: (ctx: AjaxContext, next: () => Promise<void>) => Promise<void> | void

  // Wraps the DOM swap. Call next() to run the default swap (or the next plugin).
  // Omit next() to fully replace the default swap.
  swap?: (ctx: AjaxContext, next: () => Promise<void>) => Promise<void> | void

  // Called when an error is thrown anywhere in the pipeline
  error?: (error: unknown, ctx: AjaxContext) => void
}
```

## Global plugin

```js
ajax.use(myPlugin)
```

## Per-registration plugin

Pass plugins in the `plugins` array on a registration. A per-registration plugin
with a matching `key` replaces the global plugin of the same key for that request:

```js
ajax.register({
  target: "#form",
  plugins: [myPlugin],
  swaps: [{ replace: "#result" }],
})
```

## Writing a plugin

```js
const timingPlugin = {
  async request(ctx, next) {
    const start = performance.now()
    await next()
    console.log(`${ctx.url} fetched in ${performance.now() - start}ms`)
  },
}

ajax.use(timingPlugin)
```

## Lifecycle events

Ajax dispatches custom events on `document` at each stage. These are emitted
by the built-in `events` plugin and are available to any listener on the page:

| Event | Detail |
|---|---|
| `ajax:attach` | `{ element, config }` |
| `ajax:before-request` | `AjaxContext` |
| `ajax:after-request` | `AjaxContext` |
| `ajax:before-swap` | `AjaxContext` |
| `ajax:after-swap` | `AjaxContext` |
| `ajax:error` | `{ error, context }` |
