/* Progressive enhancement only: every piece of content is visible without this file. */
(() => {
  document.documentElement.classList.add('js');
  // Compact mobile menu
  const mb = document.querySelector('[data-menu]');
  if (mb) {
    const set = o => { mb.setAttribute('aria-expanded', String(o)); mb.textContent = o ? 'Close' : 'Menu'; document.documentElement.classList.toggle('menu-open', o); };
    mb.addEventListener('click', () => set(mb.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && mb.getAttribute('aria-expanded') === 'true') { set(false); mb.focus(); } });
  }
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

  // Sparing section reveals: only major sections that start below the fold.
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('reveal-in'); e.target.classList.remove('reveal-pending'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => {
    if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('reveal-pending'); io.observe(el); }
  });
})();
