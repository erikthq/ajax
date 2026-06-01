`qute.register(config)` is the main API. Call it once per interaction type —
each call wires up event listeners and teaches Qute what to fetch and swap.

## SourceConfig

```ts
qute.register({
  target: string,               // CSS selector for trigger elements
  trigger?: string | string[],  // event(s) to listen for (default: 'click' / 'submit')
  history?: 'push' | 'replace',
  bustCache?: string | boolean,
  swaps: TargetConfig[],
})
```

## TargetConfig

```ts
{
  replace: string,                // selector for the element to replace in the current page
  with?: string | string[],       // selector(s) in the fetched page — first match wins, defaults to replace
  mode?: SwapStrategy,            // 'innerHTML' | 'outerHTML' | 'beforebegin' | ...
  transitions?: string[],         // view transition type names applied during this swap
  if?: (oldEl, newEl) => boolean, // guard — skip this swap if it returns false
  plugin?: QutePlugin,            // per-swap plugin override
}
```

## Example

```js
qute.register({
  target: '#link-about',
  history: 'push',
  swaps: [
    {
      replace: '#main',
      with: '#main',
      mode: 'innerHTML',
      transitions: ['slide-left'],
    },
  ],
})
```
