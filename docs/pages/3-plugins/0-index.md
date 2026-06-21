# Plugins

Ajax ships eight plugins. Three run by default on every registration — you do
not need to import or configure them. The rest are opt-in: import and pass to
`ajax.use()` for global scope, or include in the `plugins` array on a specific
registration.

## Built-in

These are always active:

| Plugin | Purpose |
|---|---|
| [headers](./plugin-headers) | Adds `X-Ajax-Request: true` to every fetch |
| [scripts](./plugin-scripts) | Re-executes `<script>` tags inside swapped elements |
| [events](./plugin-events) | Dispatches `ajax:*` CustomEvents on `document` |

## Optional

Import from `@erikt/ajax` and register with `ajax.use()` or per-registration:

| Plugin | Purpose |
|---|---|
| [loading](./plugin-loading) | Sets `aria-busy="true"` on an element during a request |
| [history](./plugin-history) | Calls `pushState` or `replaceState` after a swap |
| [debug](./plugin-debug) | Logs colored, grouped output for every lifecycle stage |
| [morph](./plugin-morph) | Replaces the default swap with Idiomorph diffing |
| [preload](./plugin-preload) | Preloads links as they scroll into view |
