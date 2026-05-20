# Qute

A hypermedia library focused on the [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API). Declaratively fetch and swap page fragments with smooth, typed transitions — no full page reloads.

## Usage

```html
<a href="/about" id="link-about">About</a>

<main id="content">
  <h1>Home</h1>
</main>

<script type="importmap">
  { "imports": { "@qute/core": "/qute.js" } }
</script>

<script type="module">
  import { qute } from "@qute/core";

  qute.register({
    source: "#link-about",
    swaps: [
      {
        source: "#content",
        target: "#content",
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

| Field     | Type             | Description                                                      |
| --------- | ---------------- | ---------------------------------------------------------------- |
| `source`  | `string`         | CSS selector for the trigger element                             |
| `trigger` | `string?`        | Event name. Defaults to `submit` for `<form>`, `click` otherwise |
| `swaps`   | `TargetConfig[]` | One or more swap targets                                         |

### `TargetConfig`

| Field         | Type            | Description                                                    |
| ------------- | --------------- | -------------------------------------------------------------- |
| `source`      | `string`        | CSS selector for the element to swap into                      |
| `target`      | `string`        | CSS selector used to pick a fragment from the fetched response |
| `mode`        | `SwapStrategy?` | How to insert the fragment. Defaults to `innerHTML`            |
| `transitions` | `string[]?`     | View transition types to activate                              |

### `SwapStrategy`

`innerHTML` · `outerHTML` · `beforebegin` · `afterbegin` · `beforeend` · `afterend`

## Dynamic content

Qute uses a `MutationObserver` to watch for newly added elements. Any element matching a registered `source` selector that appears after initial load — e.g. swapped in by a previous qute transition — is automatically registered.

## Fallback

When `document.startViewTransition` is not available the swap still happens, without animation.
