Plugins extend Qute's swap and element lifecycle. A plugin is a plain object
with optional hooks, registered globally via `qute.use()`.

## Plugin interface

```ts
interface QutePlugin {
  // Called once per element when it is attached to a registration
  init?: (element: HTMLElement, config: SourceConfig) => void

  // Replaces the built-in DOM swap for this element
  swap?: (oldEl: Element, newEl: Element, mode?: SwapStrategy) => Element

  // Called when bustCache fires
  invalidate?: (url?: string) => void
}
```

## Global plugin

```js
qute.use(myPlugin)
```

## Per-swap override

Set `plugin` on a `TargetConfig` to override the global plugin for that swap only:

```js
swaps: [{ replace: '#content', plugin: morphPlugin }]
```

The per-swap plugin takes precedence over the global one. Only the `swap` hook
is used for per-swap plugins — `init` and `invalidate` are global concerns.
