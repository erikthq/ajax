# Transitions

Ajax uses the View Transitions API. Each registration can declare one or more
_transition types_ — short strings set on `html` via `:active-view-transition-type()`
while the transition runs. This lets CSS drive the animation entirely.

## Declaring transition types

Pass one or more strings in the `transitions` array on a registration:

```js
ajax.register({
  target: "a[href]",
  transitions: ["slide-left"],
  plugins: [history("push")],
  swaps: [
    { replace: "#main" },
  ],
})
```

All transition types in a registration are active simultaneously during the
`startViewTransition` call that wraps that registration's swaps.

## Dynamic transition types

`transitions` also accepts a function that receives the completed `AjaxContext`
and returns the types to use. This lets you choose a transition based on the
response — for example the HTTP status code, a response header, or anything
else available after the fetch:

```js
ajax.register({
  target: "a[href]",
  transitions: (ctx) => {
    if (ctx.response?.status === 404) return ["fade"]
    return ["slide-left"]
  },
  plugins: [history("push")],
  swaps: [{ replace: "#main" }],
})
```

The function is called after the request completes, so `ctx.response` and
`ctx.incomingDocument` are both available.

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

Use two registrations — one for forward, one for back — each with a different
transition type:

```html
<nav>
  <a href="/step-1" id="link-back">Back</a>
  <a href="/step-3" id="link-forward">Next</a>
</nav>

<section id="main">
  <h1>Step 2</h1>
</section>

<script type="module">
  import ajax, { history } from "@erikt/ajax"

  ajax.register({
    target: "#link-forward",
    transitions: ["slide-forward"],
    plugins: [history("push")],
    swaps: [{ replace: "#main" }],
  })

  ajax.register({
    target: "#link-back",
    transitions: ["slide-back"],
    plugins: [history("push")],
    swaps: [{ replace: "#main" }],
  })
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

@keyframes slide-out-left  { to   { transform: translateX(-32px); opacity: 0; } }
@keyframes slide-out-right { to   { transform: translateX(32px);  opacity: 0; } }
@keyframes slide-in-left   { from { transform: translateX(-32px); opacity: 0; } }
@keyframes slide-in-right  { from { transform: translateX(32px);  opacity: 0; } }
```

## Multiple transition types

A registration with multiple transition types has all of them active at once.
Use scoped durations to prevent one long animation from holding another open:

```js
ajax.register({
  target: "#filter-form",
  transitions: ["update-list", "fade-count"],
  swaps: [
    { replace: "#results" },
    { replace: "#result-count" },
  ],
})
```

```css
html:active-view-transition-type(update-list) {
  #results {
    view-transition-name: results;
  }
  &::view-transition-old(results) { animation: 200ms ease both fade-out; }
  &::view-transition-new(results) { animation: 200ms ease both fade-in; }
}

html:active-view-transition-type(fade-count) {
  #result-count {
    view-transition-name: result-count;
  }
  &::view-transition-old(result-count) { animation: 150ms ease both fade-out; }
  &::view-transition-new(result-count) { animation: 150ms ease both fade-in; }
}

@keyframes fade-out { to   { opacity: 0; } }
@keyframes fade-in  { from { opacity: 0; } }
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
ajax.register({
  target: "#sort-form",
  transitions: ["sort"],
  swaps: [{ replace: "#list" }],
})
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
