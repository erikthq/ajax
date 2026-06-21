# Installation

`@erikt/ajax` is distributed as an ES module and requires no build step.

## CDN

The simplest way to load Ajax is a single script tag:

```html
<script type="module" src="https://esm.sh/@erikt/ajax"></script>
```

## Import map

Use an import map to reference Ajax by its package name across multiple scripts:

```html
<script type="importmap">
{
  "imports": {
    "@erikt/ajax": "https://esm.sh/@erikt/ajax"
  }
}
</script>

<script type="module">
  import ajax from "@erikt/ajax"
</script>
```

The import map must appear before any `<script type="module">` tags that use it.

## Morph plugin

The morph plugin requires `idiomorph` as a peer dependency. Add it to the import map:

```html
<script type="importmap">
{
  "imports": {
    "@erikt/ajax": "https://esm.sh/@erikt/ajax",
    "idiomorph":   "https://esm.sh/idiomorph@0.7.4"
  }
}
</script>
```

`idiomorph` is only needed when using the `morph` plugin.
