// Markdown slides.
//
// <section data-markdown="slides/intro.md"></section> in index.html is filled with
// that file's contents. The .md files are bundled at build time instead of being
// fetched at runtime, so the single-file bundle still works when opened from disk.
//
// Two fixes on top of reveal.js's Markdown plugin:
//
// 1. LaTeX would be mangled by the Markdown parser (_ means emphasis, \, is an escape),
//    so math is swapped for placeholders before parsing. Afterwards each placeholder
//    becomes <span class="md-math">, which katex.js renders. Other $ signs stay text.
//
// 2. reveal.js applies <!-- .element: ... --> to the nearest element before the comment,
//    so on a line like "- `code` text <!-- .element: class="fragment" -->" only the
//    `code` would fade in. Here the comment applies to the whole list item, paragraph
//    or heading it ends, or to the image/video right before it.

const files = import.meta.glob('../slides/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});
const byPath = Object.fromEntries(
  Object.entries(files).map(([key, text]) => [key.replace(/^\.\.\//, ''), text]),
);

// ---------------------------------------------------------------------------
// Before parsing
// ---------------------------------------------------------------------------

// [pattern, display mode]. The LaTeX itself is capture group 1.
const MATH = [
  [/\$\$([\s\S]+?)\$\$/g, true],
  [/\\\[([\s\S]+?)\\\]/g, true],
  [/\\\(([\s\S]+?)\\\)/g, false],
  // Inline $...$, Pandoc-style: no space just inside the dollars and no digit right
  // after the closing one, so "costs $5 and $10" is left alone. \$ is a literal dollar.
  [/(?<![\\$])\$(?=\S)((?:\\.|[^\\$\n])+?)(?<=\S)\$(?!\d)/g, false],
];
const PLACEHOLDER = /KATEXMATH(\d+)END/;

// Renamed so reveal.js leaves these comments alone; applyElementAttributes() handles them.
const ELEMENT_COMMENT = /<!--\s*\.element\b:?/g;
const OWN_COMMENT = /^\s*\.md-element:/;

const stash = []; // { source, tex, display } per placeholder

function prepare(markdown) {
  for (const [pattern, display] of MATH) {
    markdown = markdown.replace(pattern, (source, tex) => {
      return `KATEXMATH${stash.push({ source, tex, display }) - 1}END`;
    });
  }
  return markdown.replace(ELEMENT_COMMENT, '<!-- .md-element:');
}

/** Fill Markdown sections from slides/*.md. Call before Reveal.initialize(). */
export function loadMarkdown(root = document) {
  root.querySelectorAll('.reveal .slides section[data-markdown]').forEach((section) => {
    const path = section.getAttribute('data-markdown');
    let markdown;

    if (path) {
      markdown = byPath[path];
      if (markdown === undefined) {
        console.error(`Markdown file not found: ${path} (expected in slides/)`);
        section.removeAttribute('data-markdown');
        section.innerHTML = '<h2>Missing slides file</h2><p><code></code></p>';
        section.querySelector('code').textContent = path;
        return;
      }
      markdown = markdown.trimStart();
    } else {
      // Inline Markdown written in index.html: <textarea data-template>...</textarea>
      const template = section.querySelector('[data-template], script');
      if (!template) return;
      markdown = template.textContent;
    }

    const template = document.createElement('textarea');
    template.setAttribute('data-template', '');
    template.textContent = prepare(markdown);
    section.replaceChildren(template);
    section.setAttribute('data-markdown', ''); // inline content: nothing to fetch
  });
}

// ---------------------------------------------------------------------------
// After parsing (as a plugin listed right after reveal.js's Markdown plugin)
// ---------------------------------------------------------------------------

const BLOCKS = 'li, p, h1, h2, h3, h4, h5, h6, td, th, blockquote';
const MEDIA = new Set(['IMG', 'VIDEO', 'IFRAME']);
const ATTRIBUTE = /([^\s"=]+)="([^"]*)"|([^\s"=]+)/g;

function previousNonBlank(node) {
  let prev = node.previousSibling;
  while (prev && prev.nodeType === Node.TEXT_NODE && !prev.nodeValue.trim()) {
    prev = prev.previousSibling;
  }
  return prev;
}

function targetOf(comment) {
  const prev = previousNonBlank(comment);
  if (prev?.nodeType === Node.ELEMENT_NODE && MEDIA.has(prev.tagName)) return prev;

  const block = comment.parentElement.closest(BLOCKS);
  if (block) return block;

  // A comment on its own line between blocks: the block before it (reveal.js behavior).
  return prev?.nodeType === Node.ELEMENT_NODE ? prev : comment.parentElement;
}

function applyElementAttributes(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_COMMENT);
  const comments = [];
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (OWN_COMMENT.test(node.nodeValue)) comments.push(node);
  }

  for (const comment of comments) {
    const target = targetOf(comment);
    const spec = comment.nodeValue.replace(OWN_COMMENT, '');
    for (const [, name, value, bare] of spec.matchAll(ATTRIBUTE)) {
      if (name === 'class') target.classList.add(...value.split(/\s+/).filter(Boolean));
      else if (name) target.setAttribute(name, value);
      else target.setAttribute(bare, '');
    }
    comment.remove();
  }
}

function restoreMath(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (PLACEHOLDER.test(node.nodeValue)) nodes.push(node);
  }

  for (const node of nodes) {
    // split() with a capture group alternates: text, index, text, index, ...
    const parts = node.nodeValue.split(PLACEHOLDER);

    // In code and speaker notes, math stays as its original LaTeX source.
    if (node.parentElement.closest('code, pre, aside.notes')) {
      node.nodeValue = parts.map((part, k) => (k % 2 ? stash[part].source : part)).join('');
      continue;
    }

    const pieces = parts.map((part, k) => {
      if (k % 2 === 0) return part;
      const { tex, display } = stash[part];
      const span = document.createElement('span');
      span.className = 'md-math';
      span.dataset.display = display;
      span.textContent = tex;
      return span;
    });
    node.replaceWith(...pieces.filter((piece) => piece !== ''));
  }
}

/** reveal.js plugin: list it right after the Markdown plugin. */
export const MarkdownFixes = {
  id: 'markdown-fixes',
  init(reveal) {
    const slides = reveal.getSlidesElement();
    applyElementAttributes(slides);
    restoreMath(slides);
  },
};
