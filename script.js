(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- Toasts ---------- */
  var toastRegion = document.getElementById('toast-region');
  function toast(message) {
    var el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    toastRegion.appendChild(el);
    setTimeout(function () {
      el.classList.add('leaving');
      el.addEventListener('animationend', function () { el.remove(); });
    }, 2800);
  }

  /* ---------- Theme toggle ---------- */
  function currentTheme() {
    var set = root.getAttribute('data-theme');
    if (set) return set;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.getElementById('theme-toggle').addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('navi-theme', next); } catch (e) {}
  });

  /* ---------- Mobile menu ---------- */
  var nav = document.getElementById('nav');
  var menuBtn = document.getElementById('menu-toggle');
  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- Header border on scroll ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Copy buttons ---------- */
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = document.querySelector(btn.getAttribute('data-copy'));
      var text = target ? target.textContent : '';
      var done = function () {
        var prev = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(function () { btn.textContent = prev; }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { toast('Copy failed — select and copy manually.'); });
      } else {
        toast('Clipboard not available in this browser.');
      }
    });
  });

  /* ---------- Tabs (with arrow-key navigation) ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  function selectTab(tab) {
    tabs.forEach(function (t) {
      var selected = t === tab;
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !selected;
    });
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab); });
    tab.addEventListener('keydown', function (e) {
      var idx = null;
      if (e.key === 'ArrowRight') idx = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') idx = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') idx = 0;
      else if (e.key === 'End') idx = tabs.length - 1;
      if (idx !== null) {
        e.preventDefault();
        selectTab(tabs[idx]);
        tabs[idx].focus();
      }
    });
  });

  /* ---------- Demo: loading button ---------- */
  var loadingBtn = document.getElementById('loading-demo');
  loadingBtn.addEventListener('click', function () {
    var label = loadingBtn.querySelector('.btn-label');
    loadingBtn.classList.add('is-loading');
    label.textContent = 'Loading…';
    setTimeout(function () {
      loadingBtn.classList.remove('is-loading');
      label.textContent = 'Done!';
      setTimeout(function () { label.textContent = 'Click to load'; }, 1200);
    }, 1500);
  });

  /* ---------- Demo: toast ---------- */
  var toastMessages = ['Saved to your library', 'Invite sent to the team', 'Settings updated', 'Welcome to Navi UI 👋'];
  var toastIdx = 0;
  document.getElementById('toast-demo').addEventListener('click', function () {
    toast(toastMessages[toastIdx++ % toastMessages.length]);
  });

  /* ---------- Demo: form validation ---------- */
  document.getElementById('demo-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var email = document.getElementById('f-email');
    var valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
    email.classList.toggle('invalid', !valid);
    email.setAttribute('aria-invalid', String(!valid));
    toast(valid ? 'Form submitted — thanks!' : 'Please enter a valid email address.');
  });

  /* ---------- Subscribe ---------- */
  document.getElementById('subscribe').addEventListener('submit', function (e) {
    e.preventDefault();
    var input = document.getElementById('sub-email');
    if (!input.checkValidity()) { input.reportValidity(); return; }
    toast("You're on the list! We'll be in touch.");
    input.value = '';
  });

  /* ---------- Reveal on scroll + stat counters ---------- */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function countUp(el) {
    var end = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduced || end === 0) { el.textContent = end + suffix; return; }
    var start = null, dur = 1200;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var revealEls = document.querySelectorAll('.reveal');
  var counters = document.querySelectorAll('[data-count]');

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        if (el.hasAttribute('data-count')) countUp(el);
        else el.classList.add('visible');
        io.unobserve(el);
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 80 + 'ms';
      io.observe(el);
    });
    counters.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
    counters.forEach(countUp);
  }

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
