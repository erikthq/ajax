# headers

The headers plugin adds `X-Ajax-Request: true` to every outgoing fetch. It is
active by default — you do not need to import or configure it.

## Adding custom headers

Call `headers()` with an object to merge additional headers into every request:

```js
import ajax, { headers } from "@erikt/ajax"

ajax.use(headers({
  "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
}))
```

The default `X-Ajax-Request: true` header is always included alongside any
extras you pass.

## Server-side detection

Use the header to distinguish Ajax requests from full-page navigations and
return partial HTML instead of a full document:

```js
// Express example
app.get("/cart", (req, res) => {
  if (req.headers["x-ajax-request"]) {
    res.render("partials/cart")
  } else {
    res.render("pages/cart")
  }
})
```

## Options

| Argument | Type | Default | Description |
|---|---|---|---|
| `extra` | `Record<string, string>` | `{}` | Additional headers merged into every request |
