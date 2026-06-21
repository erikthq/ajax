import { html } from '@erikt/docgen'

export default html`
  <style>
    .home {
      max-width: 860px;
      margin: 0 auto;
      padding: 4rem 1.5rem 6rem;
      display: flex;
      flex-direction: column;
      gap: 5rem;

      .hero {
        h1 {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin: 0;
        }

        p {
          font-size: 1.2rem;
          max-width: 520px;
        }
      }
    }

    .home-hero-actions {
      display: flex;
      align-items: stretch;
      gap: 1rem;
      flex-wrap: wrap;

      code {
        display: block;
        padding: 0.5rem 1rem;
      }
    }

    .home-features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;

      hgroup {
        margin: 0;
      }
    }

    .home-example {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .home-example pre {
      margin: 0;
      padding: 1rem;
      background-color: var(--ui-neutral-100);
      border: 1px solid var(--ui-neutral-200);
      border-radius: 8px;

      max-width: calc(100vw - 3rem);
      overflow: auto;
    }
  </style>

  <div class="home">
    <div class="hero prose">
      <hgroup>
        <h1>Fragment swaps.<br />Native transitions.</h1>
        <p>
          A hypermedia library that intercepts links and forms, fetches the
          target URL, and swaps matching HTML fragments — built around the View
          Transitions API for native, CSS-driven animations.
        </p>
      </hgroup>
      <div class="home-hero-actions">
        <a href="/getting-started" class="button">Get started</a>
        <code>npm install @erikt/ajax</code>
      </div>
    </div>

    <div class="home-features prose">
      <hgroup>
        <h3>Declarative</h3>
        <p>
          Register CSS selectors as swap targets. One fetch can update multiple
          independent fragments in the same page.
        </p>
      </hgroup>
      <hgroup>
        <h3>View Transitions</h3>
        <p>
          Every swap runs inside <code>document.startViewTransition</code>. Name
          the transition type, write the CSS — no JavaScript animation logic.
        </p>
      </hgroup>
      <hgroup>
        <h3>Plugin system</h3>
        <p>
          A middleware pipeline exposes every stage of the lifecycle. Built-in
          plugins cover history, loading states, morphing, and preloading.
        </p>
      </hgroup>
      <hgroup>
        <h3>Zero overhead</h3>
        <p>
          Ships as a single ES module at 4.2 kB gzipped. No dependencies, no
          polyfills, no framework assumptions.
        </p>
      </hgroup>
    </div>

    <div class="home-example">
      <h2>Example</h2>
      <pre><code><span style="color:light-dark(#7c6af5,#a78bfa)">import</span> ajax, { history, loading } <span style="color:light-dark(#7c6af5,#a78bfa)">from</span> <span style="color:light-dark(#d97706,#fb923c)">'@erikt/ajax'</span>

ajax.<span style="color:light-dark(#0ea5e9,#38bdf8)">use</span>(loading())

ajax.<span style="color:light-dark(#0ea5e9,#38bdf8)">register</span>({
  <span style="color:light-dark(#059669,#34d399)">target</span>: <span style="color:light-dark(#d97706,#fb923c)">'nav a'</span>,
  <span style="color:light-dark(#059669,#34d399)">transitions</span>: [<span style="color:light-dark(#d97706,#fb923c)">'fade'</span>],
  <span style="color:light-dark(#059669,#34d399)">plugins</span>: [history(<span style="color:light-dark(#d97706,#fb923c)">'push'</span>)],
  <span style="color:light-dark(#059669,#34d399)">swaps</span>: [
    { <span style="color:light-dark(#059669,#34d399)">replace</span>: <span style="color:light-dark(#d97706,#fb923c)">'#main'</span> },
  ],
})</code></pre>
    </div>
  </div>
`
