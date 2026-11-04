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

The deck is assembled in `index.html`, top to bottom, from two kinds of slides:

- **Markdown files** in `slides/`: the easiest way to write text and equations.
  `<section data-markdown="slides/intro.md"></section>` inserts that file's slides at that point.
- **HTML** `<section>` elements: for custom layouts and animations (see the equation-build,
  Auto-Animate and results slides).

Edits to either reload the browser automatically.

### Markdown

```md
<!-- .slide: data-transition="zoom" -->

## Slide title

- A bullet with math $\Sigma = R S S^\top R^\top$
- Appears on the next click <!-- .element: class="fragment" -->

$$G(\vx) = \exp\big(-\tfrac12 (\vx-\vmu)^\top \Sigma^{-1} (\vx-\vmu)\big)$$

![Result](media/result.png) <!-- .element: style="height: 400px" -->

Note:
Speaker notes for this slide.

---

## Next slide
```

- `---` on its own line, with blank lines around it, starts a new slide.
- `Note:` starts the speaker notes; the rest of that slide is notes.
- `<!-- .slide: ... -->` sets options for the slide: transition, background, class.
- `<!-- .element: ... -->` at the end of a bullet, paragraph or heading applies to that whole line;
  right after an image or video it applies to the image or video. Use it for fragments
  (`class="fragment fade-up"`), click order (`data-fragment-index="2"`) or sizes.
- Math is plain LaTeX, no escaping: `$...$` or `\(...\)` inline, `$$...$$` or `\[...\]` display.
  Write `\$` for a literal dollar sign; amounts like `$5` are left alone.
- HTML works inside Markdown, e.g. `<div class="fragment">` ... `</div>` around several lines
  (with blank lines just inside the tags, so the Markdown in between is still converted).

### Everywhere

- **Speaker notes in HTML slides**: `<aside class="notes">...</aside>` inside the `<section>`.
- **Math macros**: put your paper's `\newcommand`s in `macros` in `src/main.js`.
- **Equation builds**: wrap a term in `\step{n}{...}` to reveal it on click `n`. Elements with
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
