# Unified Gaussian Primitives: talk slides

reveal.js 6 + KaTeX, served with Vite. Everything is installed locally, so the deck works offline.

## Run

```sh
npm install      # first time only
npm run dev      # opens http://localhost:5173 and reloads when you save
```

## Present

| Key | Action |
| --- | --- |
| `S` | Open the speaker view (notes, next slide, timer). Allow the pop-up if blocked. |
| `F` | Full screen (press in the slide window) |
| `B` or `.` | Black screen |
| `O` / `Esc` | Slide overview |
| `?` | All shortcuts |

With two screens: set the displays to extend, not mirror (Windows: Win+P > Extend; macOS: turn off mirroring).
Drag the slide window to the projector, press `F` there, and keep the speaker view on your laptop.

To get a pacing timer in the speaker view, set `totalTime` in `src/main.js`.

## Edit

- **Slides**: `index.html`, one `<section>` per slide.
- **Speaker notes**: `<aside class="notes">...</aside>` inside a slide.
- **Math**: `$...$` inline, `$$...$$` display. Put your paper's macros in `macros` in `src/main.js`.
- **Equation builds**: wrap a term in `\step{n}{...}` to reveal it on click `n`. HTML elements with
  `class="fragment" data-fragment-index="n"` appear at the same click.
- **Transitions**: deck default in `src/main.js`; per slide with `data-transition="fade"`
  (`none`, `fade`, `slide`, `convex`, `concave`, `zoom`).
- **Images and videos**: put files in `public/media/` and reference them as `media/name.ext`.
  Video: `<video data-autoplay muted loop data-src="media/clip.mp4"></video>` (use H.264 MP4).
- **Styling**: `src/styles.css`.

## Share it

```sh
npm run bundle   # writes bundle/ and gsr-presentation.zip
```

Send `gsr-presentation.zip`. The recipient unzips it and double-clicks `index.html`; no install or server needed.
All code, styles and math fonts are inside `index.html`, and images and videos sit next to it in `media/`.
Keep those media files in `public/media/` so they end up in the zip.

For presenting, prefer `npm run dev` (or `npm run preview`); the speaker view is only tested over http.

## Build for a web server

```sh
npm run build    # writes dist/ (separate JS/CSS/font files)
npm run preview  # serves dist/ at http://localhost:4173
```

Use `dist/` if you host the deck online. It must be served over http, so double-clicking `dist/index.html` won't work.
