# Lesson Intelligence Packs (LIP) – Static Site

Premium, mobile-first marketing site for Lesson Intelligence Packs (LIP). Built with semantic HTML, Tailwind via CDN, and minimal vanilla JavaScript.

## Quick start
1. Serve locally (any static server works):
   ```bash
   python -m http.server 8080
   ```
2. Open `http://localhost:8080` (or `http://localhost:8080/lip-site/` if you set a base path).

## Deploy to GitHub Pages
- Target branch: `main`.
- Pages source: `root`.
- After pushing, enable GitHub Pages in repository settings and pick the `main` branch / root option.

## Base path configuration (for GitHub Pages subpaths)
- Update the `<meta name="base-path" content="/lip-site">` in `index.html`, `resources/index.html`, and `404.html` to match your subpath.
- Alternatively, set `window.__BASE_PATH__ = '/lip-site'` before loading `assets/js/main.js`.
- Leave the meta content empty for root deployment.
- Links marked with `data-base="1"` are rewritten at runtime using the detected base path.

## Replacing placeholders
- PDFs (required names): place final files inside `/assets/docs/`
  - `LIP_Pilot_Snapshot.pdf`
  - `Animated_Explainers_Pilot_What_This_Includes.pdf`
  - `LIP_Short_FAQ.pdf`
  - `LIP_Sample_Frames_Guide.pdf`
  - `LIP_Style_Menu.pdf`
- Style previews (required names): replace `/assets/styles/style-01.jpg` through `/assets/styles/style-10.jpg`.
- General images: drop into `/assets/img/` and update references in HTML if needed.

## Formspree (optional)
- The contact form includes a commented `form` action: replace `FORM_ID` with your Formspree ID and uncomment the form tag.
- Keep the `mailto` handler enabled for a frictionless default experience.

## Analytics (optional)
- A commented placeholder is included in each HTML file. Insert your analytics snippet (e.g., Plausible or GA4) inside the indicated block.

## Sitemap and robots
- `sitemap.xml` lists relative paths (`/` and `/resources/`) so it remains base-path aware; search engines will resolve against the served domain.
- `robots.txt` currently allows all crawling.

## Editing styles or scripts
- Custom tokens and small tweaks live in `assets/css/styles.css` (Tailwind comes via CDN, no build step).
- Base-path handling, mobile nav, smooth scrolling, and the mailto builder are in `assets/js/main.js`.

## Content updates
- All copy blocks live in `CONTENT.md` for quick iteration. Update the HTML if you change text here.
