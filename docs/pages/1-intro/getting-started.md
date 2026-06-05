This guide walks through building a page that swaps content without full
reloads, with an animated transition.

## 1. Load Qute

Add the import map and a module script to your HTML `<head>`:

```html
<script type="importmap">
{
  "imports": {
    "@qute/core": "https://esm.sh/gh/erikthalen/qute@core-0.0.1/qute.js"
  }
}
</script>
```

## 2. Mark up your page

Qute works with your existing HTML. You need a trigger element (a link or form)
and a target element to swap content into:

```html
<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
</nav>

<main id="content">
  <h1>Home</h1>
  <p>Welcome to the home page.</p>
</main>
```

The fetched page must contain an element matching the same selector (`#content`)
for the swap to work.

## 3. Register

Tell Qute which elements trigger swaps and what to swap:

```html
<script type="module">
  import { qute } from "@qute/core"

  qute.register({
    target: "nav a",
    history: "push",
    swaps: [
      { replace: "#content" },
    ],
  })
</script>
```

Clicking any `<a>` inside `nav` now fetches the href, picks `#content` out of
the response, and swaps it into the current page — no full reload.

## 4. Add a transition

Give the swapped element a `view-transition-name` scoped to a transition type,
then define the animation in CSS:

```html
<script type="module">
  import { qute } from "@qute/core"

  qute.register({
    target: "nav a",
    history: "push",
    swaps: [
      { replace: "#content", transitions: ["fade"] },
    ],
  })
</script>

<style>
  html:active-view-transition-type(fade) {
    #content {
      view-transition-name: content;
    }
    &::view-transition-old(content) {
      animation: 200ms ease both fade-out;
    }
    &::view-transition-new(content) {
      animation: 200ms ease both fade-in;
    }
  }

  @keyframes fade-out { to   { opacity: 0; } }
  @keyframes fade-in  { from { opacity: 0; } }
</style>
```

## Next steps

- [Transitions](/api/transitions) — slide, FLIP, direction-aware animations
- [register()](/api/register) — full API reference for `qute.register()`
- [Morph plugin](/plugins/plugin-morph) — preserve focus and element state across swaps
- [Preload plugin](/plugins/plugin-preload) — prefetch pages before the user clicks
