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