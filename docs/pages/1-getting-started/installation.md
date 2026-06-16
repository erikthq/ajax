Qute is distributed as an ES module and requires no build step.

## CDN

The simplest way to load Qute is a single script tag:

```html
<script type="module" src="https://esm.sh/gh/erikthalen/qute@0.0.4/qute.js"></script>
```

The module also sets `window.qute`, so you can use it from non-module scripts
on the same page.

## Import map

Use an import map to reference Qute by its package name across multiple scripts:

```html
<script type="importmap">
{
  "imports": {
    "@qute/core": "https://esm.sh/gh/erikthalen/qute@0.0.4/qute.js"
  }
}
</script>

<script type="module">
  import { qute } from "@qute/core"
</script>
```

The import map must appear before any `<script type="module">` tags that use it.

## Plugins

Plugins are separate modules. Add them to the import map alongside core:

```html
<script type="importmap">
{
  "imports": {
    "@qute/core":    "https://esm.sh/gh/erikthalen/qute@0.0.4/qute.js",
    "@qute/morph":   "https://esm.sh/gh/erikthalen/qute@0.0.4/morph.js",
    "@qute/preload": "https://esm.sh/gh/erikthalen/qute@0.0.4/preload.js",
    "idiomorph":     "https://esm.sh/idiomorph@0.7.4"
  }
}
</script>
```

`idiomorph` is only needed when using the morph plugin.
