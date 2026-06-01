Qute uses the View Transitions API. Each swap can declare one or more
*transition types* — short strings set on `html` via `:active-view-transition-type()`
while the transition runs. This lets CSS drive the animation entirely.

## Declaring transition types

```js
swaps: [
  {
    replace: '#main',
    transitions: ['slide-left'],
  },
]
```

## Animating with CSS

Scope animations to a specific transition type so they don't interfere with each other:

```css
html:active-view-transition-type(slide-left) {
  #main {
    view-transition-name: main-content;
  }

  &::view-transition-old(main-content) {
    animation: slide-out-left 300ms ease forwards;
  }

  &::view-transition-new(main-content) {
    animation: slide-in-right 300ms ease forwards;
  }
}
```

## Multiple swaps, multiple types

When a registration has multiple swaps, all their transition types are active
simultaneously in a single `startViewTransition` call.
Use scoped durations to prevent one long animation from holding another open:

```css
html:active-view-transition-type(update-list) {
  &::view-transition-group(*) {
    animation-duration: 300ms;
  }
}
```

## Per-element names

Give each repeated element a unique `view-transition-name` via a CSS custom property
so the browser can FLIP individual items:

```html
<li style="--vt-name: item-123">...</li>
```

```css
html:active-view-transition-type(update-list) {
  li {
    view-transition-name: var(--vt-name);
  }
}
```
