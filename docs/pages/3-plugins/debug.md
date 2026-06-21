# debug

The debug plugin logs colored, grouped output in the browser console for every
stage of the Ajax lifecycle. Useful during development; remove it for production.

## Usage

```js
import ajax, { debug } from "@erikt/ajax"

ajax.use(debug)
```

## What it logs

**attach** — a collapsed group per registered element, showing its selector and
URL (`href` or `action`), the element reference, and the full config.

**request (before)** — a collapsed group showing the HTTP method and URL, the
element, request headers, and the form body if present.

**request (after)** — a single badge line with the HTTP status code, colored
green for success (`< 400`) or red for errors.

**swap** — a collapsed group showing how many elements were swapped, with each
element listed inside.

**error** — a collapsed group showing the error and the full request context.

## Example output

```js
[ajax] -  attach  #nav /about
[ajax] -  GET  /about
[ajax] -  200  /about
[ajax] -  swap  2 element(s)
```

Each badge is color-coded:
- **indigo** — attach
- **amber** — request method
- **green / red** — response status
- **purple** — swap
- **red** — error
