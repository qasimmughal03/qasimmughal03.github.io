/* Clyflo system map: a tab interface over the pipeline stages.
   Without JavaScript every stage panel stays visible (progressive enhancement). */
(() => {
  document.querySelectorAll('[data-sysmap]').forEach(map => {
    const tabs = [...map.querySelectorAll('[role="tab"]')];
    const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls')));
    if (!tabs.length || panels.some(p => !p)) return;
    map.classList.add('js-map');
    const select = (i, focus) => {
      tabs.forEach((t, j) => {
        const on = i === j;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
      });
      if (focus) tabs[i].focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i, false));
      t.addEventListener('keydown', e => {
        const n = tabs.length;
        const k = { ArrowRight: (i + 1) % n, ArrowDown: (i + 1) % n, ArrowLeft: (i - 1 + n) % n, ArrowUp: (i - 1 + n) % n, Home: 0, End: n - 1 }[e.key];
        if (k !== undefined) { e.preventDefault(); select(k, true); }
      });
    });
    select(Math.max(0, tabs.findIndex(t => t.getAttribute('aria-selected') === 'true')), false);
  });
})();
