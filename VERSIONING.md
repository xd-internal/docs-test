# Versioning Guide

This repository uses Docusaurus's built-in versioning. Here's how to cut a new version and what that means.

---

## Current State

- **`/docs/`** = `current` (unreleased / in-development docs)
- **`/versioned_docs/`** = frozen snapshots of released versions

## When to Cut a Version

Cut a new version when you tag a release of XplurData. For example, when you tag `v1.0.0` on the main repo:

```bash
cd xplurdata-docs
npm run docusaurus docs:version 1.0.0
```

This creates:
- `versioned_docs/version-1.0.0/` — frozen copy of all docs at that point
- `versioned_sidebars/version-1.0.0-sidebars.json` — frozen sidebar
- Updates `versions.json` with the new version

## Enabling the Version Dropdown in the Navbar

Once you have at least one version, uncomment this block in `docusaurus.config.js`:

```js
// { type: 'docsVersionDropdown', position: 'right' },
```

And update the `docs` preset config:

```js
docs: {
  lastVersion: '1.0.0',
  versions: {
    current: {
      label: 'v1.x (dev)',
      path: 'next',
    },
    '1.0.0': {
      label: 'v1.0.0',
      path: '1.0.0',
      banner: 'none',
    },
  },
},
```

## Editing a Past Version

Edit files under `versioned_docs/version-X.Y.Z/`. Changes to `/docs/` only affect the `current` (unreleased) version.

## Recommended Workflow

```
main branch   → /docs/           = "next" (in-progress)
tag v1.0.0    → run docs:version → /versioned_docs/version-1.0.0/
tag v1.1.0    → run docs:version → /versioned_docs/version-1.1.0/
```

Always keep `/docs/` as the living, bleeding-edge docs and only freeze on actual releases.
