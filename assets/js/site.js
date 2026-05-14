(function () {
  'use strict';

  // ── Hamburger ───────────────────────────────────────────────
  var ham = document.getElementById('ham');
  var nav = document.getElementById('primary-nav');
  if (ham && nav) {
    ham.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      ham.setAttribute('aria-expanded', String(open));
    });
  }

  // ── Contrast toggle ─────────────────────────────────────────
  var tc = document.getElementById('toggle-contrast');
  if (tc) {
    tc.addEventListener('click', function () {
      var on = document.documentElement.classList.toggle('hi-contrast');
      tc.setAttribute('aria-pressed', String(on));
      try { localStorage.setItem('ash:contrast', on ? '1' : '0'); } catch (e) {}
    });
    try {
      if (localStorage.getItem('ash:contrast') === '1') {
        document.documentElement.classList.add('hi-contrast');
        tc.setAttribute('aria-pressed', 'true');
      }
    } catch (e) {}
  }

  // ── Font-size toggle ────────────────────────────────────────
  var fsButtons = document.querySelectorAll('[data-fs]');
  fsButtons.forEach(function (b) {
    b.addEventListener('click', function () {
      var fs = b.dataset.fs;
      document.documentElement.classList.remove('font-l', 'font-xl');
      if (fs) document.documentElement.classList.add('font-' + fs);
      try { localStorage.setItem('ash:fs', fs); } catch (e) {}
    });
  });
  try {
    var savedFs = localStorage.getItem('ash:fs');
    if (savedFs) document.documentElement.classList.add('font-' + savedFs);
  } catch (e) {}

  // ── Tabs (ARIA tablist with keyboard nav) ───────────────────
  // Reads .panel[data-label][data-panel] from a .tabs-component,
  // builds the tablist, wires Arrow/Home/End keys per WAI-ARIA.
  document.querySelectorAll('.tabs-component[data-tabs]').forEach(function (comp) {
    var list = comp.querySelector('.tabs[role="tablist"]');
    var panels = comp.querySelectorAll('.tab-panels .panel');
    if (!list || !panels.length) return;

    var buttons = [];
    panels.forEach(function (panel, i) {
      var label = panel.dataset.label || ('Tab ' + (i + 1));
      var id = panel.dataset.panel || label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      panel.id = 'panel-' + id;
      panel.setAttribute('aria-labelledby', 'tab-' + id);

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tab';
      btn.role = 'tab';
      btn.id = 'tab-' + id;
      btn.dataset.tab = id;
      btn.textContent = label;
      btn.setAttribute('aria-controls', 'panel-' + id);
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.tabIndex = i === 0 ? 0 : -1;
      list.appendChild(btn);
      buttons.push(btn);

      panel.hidden = i !== 0;
    });

    function activate(idx, focus) {
      buttons.forEach(function (b, i) {
        var on = i === idx;
        b.setAttribute('aria-selected', String(on));
        b.tabIndex = on ? 0 : -1;
        panels[i].hidden = !on;
      });
      if (focus) buttons[idx].focus();
    }

    list.addEventListener('click', function (e) {
      var t = e.target.closest('.tab');
      if (!t) return;
      var idx = buttons.indexOf(t);
      if (idx > -1) activate(idx, false);
    });

    list.addEventListener('keydown', function (e) {
      var idx = buttons.indexOf(document.activeElement);
      if (idx < 0) return;
      var last = buttons.length - 1;
      var next = -1;
      if (e.key === 'ArrowRight') next = idx === last ? 0 : idx + 1;
      else if (e.key === 'ArrowLeft') next = idx === 0 ? last : idx - 1;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = last;
      if (next > -1) {
        e.preventDefault();
        activate(next, true);
      }
    });
  });
})();
