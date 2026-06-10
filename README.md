# XplurData Documentation

This repository contains the Docusaurus-powered documentation for [XplurData](https://xplurdata.com) — the self-hosted, open-source observability platform.

📖 **Live docs:** https://xplurdata.github.io/docs/

---

## Local Development

### Prerequisites
- Node.js 18+
- npm 9+

### Setup

```bash
npm install
npm start
```

This opens http://localhost:3000 with hot-reload. Edits to any `.md` file reflect instantly.

### Build

```bash
npm run build
```

Static output goes to `build/`. This is what gets deployed to GitHub Pages.

### Serve the Build Locally

```bash
npm run serve
```

---

## Deployment (GitHub Pages)

Deployment is fully automated via GitHub Actions. Every push to `main` triggers `.github/workflows/deploy.yml`, which:

1. Builds the Docusaurus site
2. Uploads the `build/` directory as a Pages artifact
3. Deploys to GitHub Pages

### First-Time Setup

1. **Create a new GitHub repo** named `docs` under your org (e.g. `xplurdata/docs`).
2. **Push this directory** to that repo's `main` branch.
3. In the repo **Settings → Pages**:
   - Source: **GitHub Actions**
4. Push any commit to `main` to trigger the first deployment.
5. Your docs will be live at `https://xplurdata.github.io/docs/`.

### Custom Domain (Optional)

To use `docs.xplurdata.com`:

1. Add a `CNAME` file to `static/` with content: `docs.xplurdata.com`
2. In your DNS, add: `CNAME docs → xplurdata.github.io`
3. In GitHub Settings → Pages, set the custom domain.

---

## Adding Documentation

1. Create a `.md` file in the appropriate `docs/` subdirectory.
2. Add frontmatter:
   ```md
   ---
   id: my-page
   title: My Page Title
   sidebar_label: Short Label
   sidebar_position: 2
   ---
   ```
3. Add the page ID to `sidebars.js`.
4. Open a PR to `main`.

## Cutting a New Version

See [VERSIONING.md](./VERSIONING.md) for the full versioning workflow.

---

## Contributing

- Found a docs bug? [Open an issue](https://github.com/xplurdata/docs/issues)
- Want to improve a page? Click **Edit this page** at the bottom of any doc
