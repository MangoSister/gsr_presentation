import Reveal from 'reveal.js';
import Markdown from 'reveal.js/plugin/markdown';
import Notes from 'reveal.js/plugin/notes';
import { loadMarkdown, MarkdownFixes } from './markdown.js';
import KaTeX from './katex.js';

import 'reveal.js/reset.css';
import 'reveal.js/reveal.css';
import 'reveal.js/theme/white.css';
import 'katex/dist/katex.min.css';
import './styles.css';

// ---------------------------------------------------------------------------
// Math (KaTeX, bundled locally, so no internet is needed at the venue)
// ---------------------------------------------------------------------------

// Paper notation: add your LaTeX \newcommand definitions here.
const macros = {
  '\\R': '\\mathbb{R}',
  '\\vx': '\\mathbf{x}',
  '\\vmu': '\\boldsymbol{\\mu}',

  // \step{n}{...}: reveal this part of an equation at fragment step n.
  // Use the same n in data-fragment-index on other elements to sync them.
  '\\step': '\\htmlData{fragment-index=#1}{#2}',
};

// ---------------------------------------------------------------------------
// reveal.js
// ---------------------------------------------------------------------------

loadMarkdown(); // fill <section data-markdown="slides/..."> from slides/*.md

Reveal.initialize({
  width: 1280, // 16:9 canvas; reveal.js scales it to fit any screen
  height: 720,
  margin: 0.06,

  hash: true, // keep the current slide when the page reloads
  slideNumber: 'c/t',

  // Default slide transition: none | fade | slide | convex | concave | zoom.
  // Override per slide with data-transition="...".
  transition: 'slide',
  transitionSpeed: 'default', // default | fast | slow
  backgroundTransition: 'fade',

  // Talk length in seconds. Turns on the pacing timer in the speaker view.
  // totalTime: 15 * 60,

  // Order matters: Markdown, then its fixes, then KaTeX. Notes: press S for the speaker view.
  plugins: [Markdown, MarkdownFixes, KaTeX({ macros }), Notes],
});
