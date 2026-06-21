# @erikt/ajax

Ajax is a lightweight hypermedia library built around the
[View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API).
It lets you declaratively fetch and swap page fragments with smooth, typed transitions —
no full page reloads, no virtual DOM.

The core idea: annotate your existing HTML with CSS selectors, tell Ajax which
elements trigger which swaps, and it handles the rest — fetching, diffing,
transitioning, and history management.

No build step. No framework. No virtual DOM. Just a script tag and your existing
server-rendered HTML.

## How it works

When a registered element is interacted with, Ajax:

1. Intercepts the event and prevents the default navigation
2. Fetches the target URL in the background
3. Picks matching fragments out of the response using CSS selectors
4. Swaps them into the current page inside a View Transition

The result is a multi-page app that feels like a single-page app, without giving
up server-rendered HTML or browser navigation primitives.

## Features

- Declarative fragment swaps via CSS selectors
- Native View Transitions API — no polyfills, no JavaScript animations
- Named transition types for fully CSS-driven animations
- Plugin system for history, loading states, morphing, preloading, and more
- No build step required
