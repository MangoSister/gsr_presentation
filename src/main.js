import Reveal from 'reveal.js';
import Notes from 'reveal.js/plugin/notes';
import renderMathInElement from 'katex/contrib/auto-render';

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
  // Use the same n in data-fragment-index on HTML elements to sync them.
  '\\step': '\\htmlData{fragment-index=#1}{#2}',
};

// Render math before reveal.js starts, so it lays out and finds fragments correctly.
renderMathInElement(document.querySelector('.reveal .slides'), {
  delimiters: [
    { left: '$$', right: '$$', display: true },
    { left: '\\[', right: '\\]', display: true },
    { left: '$', right: '$', display: false },
    { left: '\\(', right: '\\)', display: false },
  ],
  macros,
  trust: true, // allow \htmlData / \htmlClass (used by \step)
  strict: (code) => (code === 'htmlExtension' ? 'ignore' : 'warn'),
  throwOnError: false, // show bad LaTeX in red instead of breaking the deck
});

// Turn \step{n}{...} spans into reveal.js fragments.
document
  .querySelectorAll('.katex [data-fragment-index]')
  .forEach((el) => el.classList.add('fragment'));

// ---------------------------------------------------------------------------
// reveal.js
// ---------------------------------------------------------------------------

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

  plugins: [Notes], // press S to open the speaker view
});
