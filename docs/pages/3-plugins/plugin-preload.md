The preload plugin watches registered link elements via `IntersectionObserver`
and proactively loads pages before the user clicks.
It respects network conditions and supports three strategies.

## Installation

```html
<script type="importmap">
{
  "imports": {
    "@qute/core": "https://esm.sh/gh/erikthalen/qute@core-0.0.1/qute.js",
    "@qute/preload": "https://esm.sh/gh/erikthalen/qute@preload-0.0.1/preload.js"
  }
}
</script>
```

## Usage

```js
import { qute } from "@qute/core"
import { preloadPlugin } from '@qute/preload'

qute.use(preloadPlugin({
  strategy: ['prefetch', 'prerender'],
  ignore: ['/cart', '/profile'],
}))
```

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `strategy` | `PreloadStrategy \| PreloadStrategy[]` | `'prefetch'` | How to load the URL |
| `threshold` | `number` | `0` | IntersectionObserver threshold |
| `respectConnection` | `boolean` | `true` | Skip on saveData or 2G |
| `onlyNavigations` | `boolean` | `true` | Only observe links with `history` set |
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
preloadPlugin({
  ignore: [
    '/cart',              // exact pathname
    /^\/user/,           // regex
    url => url.includes('token='), // function
  ]
})
```

## Server setup

Prefetch and prerender requests include a `Sec-Purpose: prefetch` header.
Return a short `max-age` so responses are cached but don't go stale:

```js
const isPrefetch = req.headers['sec-purpose']?.startsWith('prefetch')
res.setHeader('Cache-Control', isPrefetch ? 'max-age=10' : 'no-store')
```
