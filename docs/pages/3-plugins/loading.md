# loading

The loading plugin sets `aria-busy="true"` on an element while a request is in
flight and removes it when the request completes — regardless of whether it
succeeded or failed.

## Usage

### Default — mark the triggering element

With no argument, `loading()` marks the element that triggered the request:

```js
import ajax, { loading } from "@erikt/ajax"

ajax.use(loading())
```

### CSS selector — mark a specific element

Pass a CSS selector to mark a fixed element instead:

```js
ajax.use(loading("#status-bar"))
```

### Callback — derive the target from the request context

Pass a function to compute the target dynamically. The function receives the
full `AjaxContext` and should return an `Element` or `null`:

```js
ajax.register({
  target: "#cart-form",
  plugins: [loading(ctx => ctx.element.closest(".card"))],
  swaps: [{ replace: "#cart" }],
})
```

## Overriding the global loading plugin

`loading` uses a plugin key of `"loading"`. A per-registration `loading()`
instance automatically replaces the global one for that request — the global
plugin is not also run.

```js
ajax.use(loading())  // global: marks the trigger element

ajax.register({
  target: "#search-form",
  plugins: [loading("#spinner")],  // overrides global for this registration only
  swaps: [{ replace: "#results" }],
})
```

## Styling

Use the `[aria-busy="true"]` attribute selector to drive loading styles in CSS:

```css
[aria-busy="true"] {
  opacity: 0.6;
  pointer-events: none;
  cursor: wait;
}
```

## Options

| Argument | Type | Default | Description |
|---|---|---|---|
| `target` | `string \| ((ctx) => Element \| null)` | triggering element | Element to mark as busy |
