# head

The head plugin updates parts of the document `<head>` after a swap completes,
keeping page metadata in sync when navigating without a full page load.

## Usage

```js
import ajax, { head } from "@erikt/ajax"

ajax.use(head({ title: true }))
```

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `title` | `boolean` | `false` | Update `document.title` from the `<title>` in the fetched document |
