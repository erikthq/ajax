Qute uses the View Transitions API. Each swap can declare one or more
_transition types_ — short strings set on `html` via `:active-view-transition-type()`
while the transition runs. This lets CSS drive the animation entirely.

## Declaring transition types

Pass one or more strings in the `transitions` array on a swap config:

```js
qute.register({
  target: "a[href]",
  history: "push",
  swaps: [
    {
      replace: "#main",
      transitions: ["slide-left"],
    },
  ],
});
```

## Animating with CSS

Scope both the `view-transition-name` and the animations inside the transition
type block so they only apply during that specific transition:

```css
html:active-view-transition-type(slide-left) {
  #main {
    view-transition-name: main;
  }
  &::view-transition-old(main) {
    animation: 300ms ease both slide-out-left;
  }
  &::view-transition-new(main) {
    animation: 300ms ease both slide-in-right;
  }
}

@keyframes slide-out-left {
  to {
    transform: translateX(-32px);
    opacity: 0;
  }
}
@keyframes slide-in-right {
  from {
    transform: translateX(32px);
    opacity: 0;
  }
}
```

## Direction based on navigation

Use two transition types — one for forward, one for back — and swap between
them in the event handler:

```html
<nav>
  <a href="/step-1" class="nav-link" data-direction="back">Back</a>
  <a href="/step-3" class="nav-link" data-direction="forward">Next</a>
</nav>

<section id="main">
  <h1>Step 2</h1>
</section>

<script type="module">
  import { qute } from "@qute/core";

  qute.register({
    target: ".nav-link",
    history: "push",
    swaps: [
      {
        replace: "#main",
        transitions: [], // filled in dynamically below
      },
    ],
  });

  document.addEventListener("qute:before", (e) => {
    const direction = e.detail.trigger.dataset.direction ?? "forward";
    e.detail.swaps[0].config.transitions = [`slide-${direction}`];
  });
</script>
```

```css
html:active-view-transition-type(slide-forward) {
  #main {
    view-transition-name: main;
  }
  &::view-transition-old(main) {
    animation: 300ms ease both slide-out-left;
  }
  &::view-transition-new(main) {
    animation: 300ms ease both slide-in-right;
  }
}

html:active-view-transition-type(slide-back) {
  #main {
    view-transition-name: main;
  }
  &::view-transition-old(main) {
    animation: 300ms ease both slide-out-right;
  }
  &::view-transition-new(main) {
    animation: 300ms ease both slide-in-left;
  }
}

@keyframes slide-out-left {
  to {
    transform: translateX(-32px);
    opacity: 0;
  }
}
@keyframes slide-out-right {
  to {
    transform: translateX(32px);
    opacity: 0;
  }
}
@keyframes slide-in-left {
  from {
    transform: translateX(-32px);
    opacity: 0;
  }
}
@keyframes slide-in-right {
  from {
    transform: translateX(32px);
    opacity: 0;
  }
}
```

## Multiple swaps, multiple types

When a registration has multiple swaps, all their transition types are active
simultaneously in a single `startViewTransition` call.
Use scoped durations to prevent one long animation from holding another open:

```js
qute.register({
  target: "#filter-form",
  swaps: [
    { replace: "#results", transitions: ["update-list"] },
    { replace: "#result-count", transitions: ["fade"] },
  ],
});
```

```css
html:active-view-transition-type(update-list) {
  #results {
    view-transition-name: results;
  }
  &::view-transition-old(results) {
    animation: 200ms ease both fade-out;
  }
  &::view-transition-new(results) {
    animation: 200ms ease both fade-in;
  }
}

html:active-view-transition-type(fade) {
  #result-count {
    view-transition-name: result-count;
  }
  &::view-transition-old(result-count) {
    animation: 150ms ease both fade-out;
  }
  &::view-transition-new(result-count) {
    animation: 150ms ease both fade-in;
  }
}

@keyframes fade-out {
  to {
    opacity: 0;
  }
}
@keyframes fade-in {
  from {
    opacity: 0;
  }
}
```

## Per-element names (FLIP lists)

Give each repeated element a unique `view-transition-name` so the browser
can animate individual items moving, entering, and leaving:

```html
<!-- server renders the style attribute with a stable per-item id -->
<ul id="list">
  <li style="view-transition-name: item-1">Apples</li>
  <li style="view-transition-name: item-2">Bananas</li>
  <li style="view-transition-name: item-3">Cherries</li>
</ul>
```

```js
qute.register({
  target: "#sort-form",
  swaps: [{ replace: "#list", transitions: ["sort"] }],
});
```

```css
html:active-view-transition-type(sort) {
  &::view-transition-group(*) {
    animation-duration: 300ms;
    animation-timing-function: ease;
  }
}
```

The browser automatically FLIP-animates each `<li>` from its old position
to its new one. No keyframes needed — `view-transition-group` handles the
positional interpolation.
