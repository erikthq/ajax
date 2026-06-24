# preload

The preload plugin watches registered link elements via `IntersectionObserver`
and proactively loads pages before the user clicks.
It respects network conditions and supports three strategies.

## Usage

`preload` is included in `@erikt/ajax` — no separate package needed:

```js
import ajax, { preload } from "@erikt/ajax"

ajax.use(preload({
  strategy: ["prefetch", "prerender"],
  ignore: ["/cart", "/profile"],
}))
```

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `strategy` | `PreloadStrategy \| PreloadStrategy[]` | `'prefetch'` | How to load the URL |
| `threshold` | `number` | `0` | IntersectionObserver threshold |
| `respectConnection` | `boolean` | `true` | Skip on saveData or 2G |
| `ignore` | `IgnoreRule \| IgnoreRule[]` | `[]` | URLs to never preload |

## Strategies

**`prefetch`** — Injects `<link rel="prefetch">`.
Caches the response in the HTTP cache so navigation skips the network wait.

**`prerender`** — Uses the [Speculation Rules API](https://developer.chrome.com/docs/web-platform/prerender-pages)
to fully render the page in a hidden tab. Navigation is instant.
Falls back to prefetch when unsupported.

**`fetch`** — Fires a low-priority `fetch()`.
Useful for warming server-side caches without storing a browser-side response.

## Ignoring routes

Pass a string (matched against `pathname`), `RegExp`, or a function:

```js
preload({
  ignore: [
    "/cart",                       // exact pathname
    /^\/user/,                     // regex
    url => url.includes("token="), // function
  ]
})
```

## Invalidating the cache

`invalidate` returns a plugin that clears prefetched entries at swap time —
add it to a registration's `plugins` array to automatically bust the cache
after a mutation that would make a cached response stale:

```js
const preloader = preload()
ajax.use(preloader)

ajax.register({
  target: "#product form",
  plugins: [preloader.invalidate("/cart")],
  swaps: [{ replace: "#cart-button" }],
})
```

Call `invalidate` with no argument to clear everything:

```js
ajax.register({
  target: "#logout-form",
  plugins: [preloader.invalidate()],
  swaps: [{ replace: "#nav" }],
})
```

## Server setup

Prefetch and prerender requests include a `Sec-Purpose: prefetch` header.
Return a short `max-age` so responses are cached but don't go stale:

```js
const isPrefetch = req.headers["sec-purpose"]?.startsWith("prefetch")
res.setHeader("Cache-Control", isPrefetch ? "max-age=10" : "no-store")
```
