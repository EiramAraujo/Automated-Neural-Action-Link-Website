# A.N.A.L. — Automated Network Action Link

Landing page for a service that bridges Twitch channel rewards and alerts with custom physical devices built around MCUs (Raspberry Pi, Orange Pi, etc.).

## Preview locally

Option A — just open `index.html` in a browser.

Option B — serve from a local HTTP server (better for video autoplay and caching):

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages

1. Push to `master`.
2. Repo → **Settings** → **Pages**.
3. Source: **Deploy from a branch** → Branch: `master` → Folder: `/ (root)`.
4. Save. The site will be available at `https://<user>.github.io/<repo>/`.

The `.nojekyll` file is included so GitHub Pages serves files as-is without Jekyll processing.

## Project structure

```
assets/           URL-safe renamed copies of media
  images/         portrait + chat screenshots
  videos/         WebM clips (infomercial + activation)
  posters/        JPG poster frames for each WebM
my assets/        original source files (kept untouched)
styles/main.css   all styles
scripts/
  i18n.js         ES/EN dictionary + toggle
  main.js         nav, scroll, lazy video, YouTube facade, copy-email
index.html        single-page entry
```

## Editing translations

Open `scripts/i18n.js` and edit the `es` / `en` dictionary objects. Any element with a matching `data-i18n="key"` attribute in `index.html` will pick up the change on the next load.

## Contact

Eiram Araujo — eiramaraujo1998@gmail.com
