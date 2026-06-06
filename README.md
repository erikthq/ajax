# Qute

A hypermedia library focused on the [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API). Declaratively fetch and swap page fragments with smooth, typed transitions — no full page reloads.

→ [Documentation](https://erikthalen.github.io/qute)

---

## Development

**Requirements:** Node.js ≥ 23, pnpm 10

```bash
git clone https://github.com/erikthalen/qute.git
cd qute
pnpm install
```

### Packages

| Package | Description |
| --- | --- |
| `packages/core` | Core library (`qute.js`) |
| `packages/morph` | Idiomorph swap plugin (`morph.js`) |
| `packages/preload` | Preload/prefetch plugin (`preload.js`) |
| `packages/example` | Example Hono server |
| `packages/honodocs` | Docs server |

### Start dev servers

```bash
pnpm dev
```

Runs all packages in parallel. The example app starts at `http://localhost:3000`, the docs at `http://localhost:3001`.

Core and plugins watch their source files and rebuild on change. The example server watches for file changes and restarts automatically.

### Build

```bash
pnpm build
```

Builds core and all plugins. Output goes to `/dist` at the workspace root:

```
dist/
  qute.js
  qute.js.map
  qute.d.ts
  morph.js
  morph.js.map
  morph.d.ts
  preload.js
  preload.js.map
  preload.d.ts
```

---

## Release

Releases are triggered automatically when `packages/core/package.json` is pushed to `main` with a changed `version` field.

### How to release

**1. Bump the version in `packages/core/package.json`:**

```bash
# edit packages/core/package.json
# change "version": "0.0.4" → "version": "0.0.5"
```

**2. Commit and push to main:**

```bash
git add packages/core/package.json
git commit -m "release: 0.0.5"
git push
```

**3. The GitHub Action takes over:**

- Detects the version change
- Builds core, morph, and preload
- Switches to the `releases` branch
- Commits all built files to the root of that branch
- Creates a GitHub Release tagged `0.0.5`

### What gets released

All three packages are released together on the same tag. After a release, the built files are accessible via esm.sh:

```
https://esm.sh/gh/erikthalen/qute@0.0.5/qute.js
https://esm.sh/gh/erikthalen/qute@0.0.5/morph.js
https://esm.sh/gh/erikthalen/qute@0.0.5/preload.js
```

### Versioning

Only the core version drives releases — morph and preload are always released at the same version as core. Bump `packages/core/package.json` to cut a new release for everything.
