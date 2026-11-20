/* Progressive enhancement only: every piece of content is visible without this file. */
(() => {
  // Clyflo showcase: one tab list over three panes (frame + description + case-study link).
  document.querySelectorAll('[data-showcase]').forEach(root => {
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    const panes = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));
    if (!tabs.length || panes.some(p => !p)) return;
    root.classList.add('js-showcase');
    panes.forEach(p => p.setAttribute('role', 'tabpanel'));
    const select = (i, focus) => {
      tabs.forEach((t, j) => {
        const on = i === j;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        panes[j].hidden = !on;
      });
      if (focus) tabs[i].focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i, false));
      t.addEventListener('keydown', e => {
        const n = tabs.length;
        const k = { ArrowRight: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
        if (k !== undefined) { e.preventDefault(); select(k, true); }
      });
    });
    select(0, false);
  });

  // Portrait depth: a few pixels of drift toward the pointer (desktop with a mouse only).
  const portrait = document.querySelector('.hero-portrait img');
  if (portrait && matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) {
    addEventListener('pointermove', e => {
      const x = (e.clientX / innerWidth - .5) * -10, y = (e.clientY / innerHeight - .5) * -8;
      portrait.style.setProperty('--px', x.toFixed(1) + 'px'); portrait.style.setProperty('--py', y.toFixed(1) + 'px');
    }, { passive: true });
  }

  // Sparing section reveals: only major sections that start below the fold.
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('reveal-in'); e.target.classList.remove('reveal-pending'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => {
    if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('reveal-pending'); io.observe(el); }
  });
})();
