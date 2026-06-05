# Qute

A hypermedia library focused on the [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API). Declaratively fetch and swap page fragments with smooth, typed transitions — no full page reloads.

## Usage

```html
<a href="/about" id="link-about">About</a>

<main id="content">
  <h1>Home</h1>
</main>

<script type="module">
  import { qute } from "https://esm.sh/gh/erikthalen/qute@core-0.0.1/qute.js"

  qute.register({
    target: "#link-about",
    swaps: [
      {
        replace: "#content",
        with: "#content",
        transitions: ["slide-left"],
      },
    ],
  });
</script>

<style>
  #content {
    view-transition-name: content;
  }

  :root:active-view-transition-type(slide-left) {
    &::view-transition-old(content) {
      animation: 300ms ease both slide-out;
    }
    &::view-transition-new(content) {
      animation: 300ms ease both slide-in;
    }
  }

  @keyframes slide-out {
    to {
      transform: translateX(-20px);
      opacity: 0;
    }
  }
  @keyframes slide-in {
    from {
      transform: translateX(20px);
      opacity: 0;
    }
  }
</style>
```

## API

### `qute.register(config)`

| Field     | Type                   | Description                                                      |
| --------- | ---------------------- | ---------------------------------------------------------------- |
| `target`  | `string`               | CSS selector for the trigger element                             |
| `trigger` | `string?`              | Event name. Defaults to `submit` for `<form>`, `click` otherwise |
| `swaps`   | `TargetConfig[]`       | One or more swap targets                                         |
| `history` | `'push'\|'replace'?`  | Update browser history after a swap. `'push'` adds a new entry, `'replace'` updates the current one |

### `TargetConfig`

| Field         | Type            | Description                                                    |
| ------------- | --------------- | -------------------------------------------------------------- |
| `replace`     | `string`        | CSS selector for the element to swap into                      |
| `with`        | `string`        | CSS selector used to pick a fragment from the fetched response |
| `mode`        | `SwapStrategy?` | How to insert the fragment. Defaults to `innerHTML`            |
| `transitions` | `string[]?`     | View transition types to activate                              |

### `SwapStrategy`

`innerHTML` · `outerHTML` · `beforebegin` · `afterbegin` · `beforeend` · `afterend`

## Events

Qute fires `CustomEvent`s that bubble, so you can listen on any ancestor or on `document`.

| Event         | Fires from      | When                               |
| ------------- | --------------- | ---------------------------------- |
| `qute:before` | trigger element | Before the network request is made |
| `qute:after`  | trigger element | After the DOM has been updated     |
| `qute:error`  | trigger element | When the fetch fails               |

Each event fires **once per lifecycle**, regardless of how many entries are in `swaps`.

`qute:before` carries a `QuteBeforeDetail` in `event.detail`:

| Field     | Type                                          | Description                                        |
| --------- | --------------------------------------------- | -------------------------------------------------- |
| `trigger` | `HTMLElement`                                 | The element that was clicked / submitted           |
| `url`     | `string`                                      | The URL that will be fetched                       |
| `swaps`   | `Array<{ config: TargetConfig; element: Element }>` | Each planned swap and the element to be replaced |

`qute:after` carries a `QuteAfterDetail` in `event.detail`:

| Field     | Type                                                                          | Description                              |
| --------- | ----------------------------------------------------------------------------- | ---------------------------------------- |
| `trigger` | `HTMLElement`                                                                 | The element that was clicked / submitted |
| `url`     | `string`                                                                      | The URL that was fetched                 |
| `swaps`   | `Array<{ config: TargetConfig; element: Element; previousElement: Element }>` | Each completed swap with before/after elements |

`qute:error` carries a `QuteErrorDetail`: `{ trigger, url, error }`.

```js
document.addEventListener("qute:after", (e) => {
  const { trigger, url, swaps } = e.detail;
  for (const { element, previousElement } of swaps) {
    console.log(`${trigger.id} replaced`, previousElement, "with", element, "from", url);
  }
});
```

## Dynamic content

Qute uses a `MutationObserver` to watch for newly added elements. Any element matching a registered `source` selector that appears after initial load — e.g. swapped in by a previous qute transition — is automatically registered.

## Fallback

When `document.startViewTransition` is not available the swap still happens, without animation.
