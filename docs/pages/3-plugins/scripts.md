# scripts

The scripts plugin re-executes `<script>` tags found inside swapped elements.
It is active by default — you do not need to import or configure it.

## Why it exists

Browsers do not run scripts injected via `innerHTML`. When Ajax swaps a
fragment that contains a `<script>` tag — an analytics snippet, a widget
initializer, a small inline behaviour — the script would be silently ignored
without this plugin.

The plugin works by replacing each `<script>` with a fresh clone after the
swap completes. The browser treats the new element as a first-time insertion
and executes it.

## Behaviour

- Runs after every swap, on each element in `ctx.swappedElements`
- Handles both inline scripts (`<script>text</script>`) and external scripts
  (`<script src="...">`)
- Preserves all attributes (`type`, `defer`, `async`, `data-*`, etc.)
- Does nothing if no `<script>` tags are present in the swapped content
