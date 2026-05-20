# Qute

A hypermedia library focused on the [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API). Declaratively fetch and swap page fragments with smooth, typed transitions — no full page reloads.

## How it works

Qute intercepts clicks on links, form submissions, or any element you configure. It fetches the target URL, parses the response as HTML, selects the relevant fragments, and swaps them into the current page — each inside its own `document.startViewTransition({ types })` call.

## Installation

```ts
import { qute } from '@qute/core'
```

## Usage

```ts
qute.register({
  source: '#my-link',
  swaps: [
    {
      source: '#content',
      target: '#content',
      mode: 'innerHTML',
      transitions: ['fade'] },
    },
  ],
})
```

### Multiple targets

One trigger can drive multiple simultaneous swaps. All swaps run inside a single `document.startViewTransition()` with the union of all types active at once — so each element can be animated independently using its `view-transition-name`.

```ts
qute.register({
  source: '#my-form',
  swaps: [
    {
      source: '#result',
      target: '#result-fragment',
      mode: 'outerHTML',
      transitions: ['slide-in'] },
    },
    {
      source: '#sidebar',
      target: '#sidebar-fragment',
      mode: 'innerHTML',
      transitions: ['fade'] },
    },
  ],
})
```

### Forms

When the source element is a `<form>`, the trigger defaults to `submit` and the form data is sent as the request body.

```ts
qute.register({
  source: '#my-form',
  swaps: [
    {
      source: '#my-form',
      target: '#response-fragment',
      mode: 'outerHTML',
      transitions: ['form-submitted'] },
    },
  ],
})
```

### Custom trigger

Override the default event with the `trigger` option.

```ts
qute.register({
  source: '#my-element',
  trigger: 'mouseenter',
  swaps: [...],
})
```

## CSS transitions

Transition types are applied to `:root` via `:active-view-transition-type()`. Target elements by their `view-transition-name`:

```css
#content {
  view-transition-name: content;
}

:root:active-view-transition-type(fade) {
  &::view-transition-old(content) { animation: 300ms ease both fade-out; }
  &::view-transition-new(content) { animation: 300ms ease both fade-in; }
}

:root:active-view-transition-type(slide-in) {
  &::view-transition-old(content) { animation: 300ms ease both slide-out; }
  &::view-transition-new(content) { animation: 300ms ease both slide-in; }
}
```

## API

### `qute.register(config)`

| Field | Type | Description |
|---|---|---|
| `source` | `string` | CSS selector for the trigger element |
| `trigger` | `string?` | Event name. Defaults to `submit` for `<form>`, `click` otherwise |
| `swaps` | `TargetConfig[]` | One or more swap targets |

### `TargetConfig`

| Field | Type | Description |
|---|---|---|
| `source` | `string` | CSS selector for the element to swap into |
| `target` | `string` | CSS selector used to pick a fragment from the fetched response |
| `mode` | `SwapStrategy?` | How to insert the fragment. Defaults to `innerHTML` |
| `transitions` | `string[]?` | View transition types to activate |

### `SwapStrategy`

`innerHTML` · `outerHTML` · `beforebegin` · `afterbegin` · `beforeend` · `afterend`

## Dynamic content

Qute uses a `MutationObserver` to watch for newly added elements. Any element matching a registered `source` selector that appears after initial load — e.g. swapped in by a previous qute transition — is automatically registered.

## Fallback

When `document.startViewTransition` is not available the swap still happens, without animation.
