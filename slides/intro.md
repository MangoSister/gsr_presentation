## Fragments: click-by-click builds

- `fragment` fades in (the default) <!-- .element: class="fragment" -->
- `fade-up` slides up while fading in <!-- .element: class="fragment fade-up" -->
- `fade-in-then-semi-out` dims on the next click <!-- .element: class="fragment fade-in-then-semi-out" -->
- `highlight-blue` is visible, then turns blue <!-- .element: class="fragment highlight-blue" -->
- `grow` scales up <!-- .element: class="fragment grow" -->
- <span class="fragment strike">`strike` gets crossed out</span>

Written in Markdown: slides/intro.md <!-- .element: class="demo-note" -->

Note:
Placeholder note for the fragments slide. The "Upcoming" panel in the speaker view
shows the next click, not just the next slide.

---

## Equations with KaTeX

Each primitive is an anisotropic 3D Gaussian with mean $\vmu \in \R^3$ and covariance $\Sigma$:

$$G(\vx) = \exp\!\Big(-\tfrac{1}{2}\,(\vx-\vmu)^\top \Sigma^{-1} (\vx-\vmu)\Big)$$

<div class="fragment fade-up">

factored into a rotation $R$ and a scale $S$ so it stays positive semi-definite:

$$\Sigma = R\,S\,S^\top R^\top$$

</div>

Math is plain LaTeX, even where Markdown would interfere: $c_i$ and $\alpha_i$ keep their subscripts. <!-- .element: class="demo-note" -->

Note:
Placeholder note. Speaker notes show math as plain LaTeX, e.g. $\Sigma = R S S^\top R^\top$.
