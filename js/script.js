(() => {
  'use strict';

  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const storage = {
    get(key) {
      try { return localStorage.getItem(key); } catch { return null; }
    },
    set(key, value) {
      try { localStorage.setItem(key, value); } catch { /* sin persistencia */ }
    },
  };

  const renderTokens = () => {
    const styles = getComputedStyle(root);
    document.querySelectorAll('[data-token]').forEach((el) => {
      el.textContent = styles.getPropertyValue(el.dataset.token).trim();
    });
  };

  const THEME_KEY = 'jv-theme';
  const themeButtons = document.querySelectorAll('.theme-toggle [data-theme-value]');

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    themeButtons.forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.themeValue === theme));
    });
    renderTokens();
    document.dispatchEvent(new Event('themechange'));
  };

  const savedTheme = storage.get(THEME_KEY);
  applyTheme(savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark');

  themeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.themeValue);
      storage.set(THEME_KEY, btn.dataset.themeValue);
    });
  });

})();

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');

  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menuToggle.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
  };

  menuToggle.addEventListener('click', () => {
    setMenu(!nav.classList.contains('is-open'));
  });

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      setMenu(false);
      menuToggle.focus();
    }
  });

  window.matchMedia('(min-width: 60.0625rem)').addEventListener('change', (event) => {
    if (event.matches) setMenu(false);
  });

  const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          if (active) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach((section) => observer.observe(section));
  }

})();