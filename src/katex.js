// KaTeX as a reveal.js plugin. List it after the Markdown plugins, so it runs once
// Markdown slides are converted and before reveal.js sets up fragments.
import katex from 'katex';
import renderMathInElement from 'katex/contrib/auto-render';

export default function KaTeX({ macros = {} } = {}) {
  const options = {
    macros,
    trust: true, // allow \htmlData / \htmlClass (used by \step)
    strict: (code) => (code === 'htmlExtension' ? 'ignore' : 'warn'),
    throwOnError: false, // show bad LaTeX in red instead of breaking the deck
  };

  return {
    id: 'katex-local',
    init(reveal) {
      const slides = reveal.getSlidesElement();

      // Markdown slides: the math was already located before parsing (markdown.js).
      slides.querySelectorAll('.md-math').forEach((el) => {
        katex.render(el.textContent, el, { ...options, displayMode: el.dataset.display === 'true' });
      });

      // HTML slides: find $...$, $$...$$, \(...\) and \[...\] in the text.
      for (const section of slides.querySelectorAll('section')) {
        if (section.hasAttribute('data-markdown-parsed') || section.querySelector('section')) continue;
        renderMathInElement(section, {
          ...options,
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '\\[', right: '\\]', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false },
          ],
          // Speaker notes stay as plain LaTeX: the speaker view has no KaTeX styles.
          ignoredClasses: ['notes'],
        });
      }

      // Turn \step{n}{...} spans into reveal.js fragments.
      slides
        .querySelectorAll('.katex [data-fragment-index]')
        .forEach((el) => el.classList.add('fragment'));
    },
  };
}
