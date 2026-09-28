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

  const filterButtons = document.querySelectorAll('.filter-bar [data-filter]');
  const projectCards = document.querySelectorAll('#projects-grid .project-card');
  const filterStatus = document.getElementById('filter-status');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      let visible = 0;

      filterButtons.forEach((btn) => btn.setAttribute('aria-pressed', String(btn === button)));

      projectCards.forEach((card) => {
        const techs = card.dataset.tech.split(' ');
        const match = filter === 'todos' || techs.includes(filter);
        card.hidden = !match;
        if (match) visible += 1;
      });

      filterStatus.textContent = `${visible} ${visible === 1 ? 'proyecto mostrado' : 'proyectos mostrados'}`;
    });
  });

  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalProblem = document.getElementById('modal-problem');
  const modalRole = document.getElementById('modal-role');
  const modalTech = document.getElementById('modal-tech');
  const modalLinks = document.getElementById('modal-links');
  let lastTrigger = null;

  const openProject = (card, trigger) => {
    modalTitle.textContent = card.querySelector('.card__title').textContent;
    modalDesc.textContent = card.querySelector('.project-card__desc').textContent;
    modalProblem.textContent = card.dataset.problem || '';
    modalRole.textContent = card.dataset.role || '';

    modalTech.replaceChildren(
      ...[...card.querySelectorAll('.badge')].map((badge) => {
        const item = document.createElement('li');
        item.className = 'badge';
        item.textContent = badge.textContent;
        return item;
      })
    );

    modalLinks.replaceChildren(
      ...[...card.querySelectorAll('.project-card__repo')].map((link) => {
        const anchor = document.createElement('a');
        anchor.className = 'btn btn--primary btn--sm';
        anchor.href = link.href;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.textContent = link.textContent;
        return anchor;
      })
    );

    lastTrigger = trigger;
    modal.showModal();
  };

  document.querySelectorAll('.js-open-project').forEach((button) => {
    button.addEventListener('click', () => openProject(button.closest('.project-card'), button));
  });

  modal.querySelector('.modal__close').addEventListener('click', () => modal.close());

  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.close();
  });

  modal.addEventListener('close', () => {
    if (lastTrigger) lastTrigger.focus();
  });

  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  // Solo letras (con tildes y ñ), espacios, apóstrofo y guion
  const onlyLettersPattern = /^[\p{L}]+(?:[ '’-][\p{L}]+)*$/u;
  const notAllowedInName = /[^\p{L}\s'’-]/gu;

  const rules = {
    nombre: (value) => {
      if (value.trim().length < 3) return 'Escribe tu nombre (mínimo 3 caracteres).';
      return onlyLettersPattern.test(value.trim().replace(/\s+/g, ' ')) ? '' : 'El nombre solo puede contener letras.';
    },
    correo: (value) => {
      if (!value.trim()) return 'Escribe tu correo electrónico.';
      return emailPattern.test(value.trim()) ? '' : 'Usa un correo válido, por ejemplo nombre@dominio.com.';
    },
    mensaje: (value) => (value.trim().length >= 20 ? '' : 'El mensaje debe tener al menos 20 caracteres.'),
  };

  const validateField = (field) => {
    const message = rules[field.name](field.value);
    const error = document.getElementById(`error-${field.name}`);
    error.textContent = message;
    field.setAttribute('aria-invalid', String(Boolean(message)));
    return !message;
  };

  const fields = Object.keys(rules).map((name) => form.elements[name]);

  // El nombre no acepta números ni símbolos: se eliminan al escribir o pegar
  form.nombre.addEventListener('input', () => {
    const clean = form.nombre.value
      .replace(notAllowedInName, '')
      .replace(/^\s+/, '')
      .replace(/\s{2,}/g, ' ');
    if (clean !== form.nombre.value) form.nombre.value = clean;
  });

  fields.forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') validateField(field);
    });
  });

  const submitBtn = document.getElementById('form-submit');

  const setStatus = (text, isError = false) => {
    formStatus.textContent = text;
    formStatus.classList.toggle('form__status--error', isError);
  };

  const openMailClient = (nombre, correo, mensaje) => {
    const subject = encodeURIComponent(`Contacto desde el portafolio: ${nombre}`);
    const body = encodeURIComponent(`${mensaje}\n\nResponder a: ${correo}`);
    window.location.href = `mailto:${form.dataset.to}?subject=${subject}&body=${body}`;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setStatus('');

    const results = fields.map(validateField);
    if (results.includes(false)) {
      fields[results.indexOf(false)].focus();
      return;
    }

    const nombre = form.nombre.value.trim();
    const correo = form.correo.value.trim();
    const mensaje = form.mensaje.value.trim();

    if (form.elements.botcheck && form.elements.botcheck.checked) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
      const response = await fetch(form.dataset.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: form.dataset.accessKey,
          subject: `Contacto desde el portafolio: ${nombre}`,
          from_name: nombre,
          name: nombre,
          email: correo,
          message: mensaje,
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) throw new Error(data.message || 'Error de envío');

      setStatus('¡Mensaje enviado! Te responderé pronto.');
      form.reset();
      fields.forEach((field) => field.removeAttribute('aria-invalid'));
    } catch {
      setStatus('No se pudo enviar desde la página. Se abrirá tu correo para que lo envíes desde allí.', true);
      openMailClient(nombre, correo, mensaje);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar mensaje';
    }
  });

  const backToTop = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    backToTop.hidden = window.scrollY < 500;
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  const canvas = document.querySelector('.hero__canvas');

  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    const hero = canvas.parentElement;
    const LINK_DISTANCE = 150;
    const MAX_NODES = 80;
    const colors = { line: '110,168,255', dot: '251,241,222', accent: '255,138,20' };
    let nodes = [];
    let width = 0;
    let height = 0;
    let frameId = null;
    let lastTime = 0;
    let heroVisible = true;

    const hexToRgb = (hex) => {
      const clean = hex.trim().replace('#', '');
      const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
      const n = parseInt(full, 16);
      return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
    };

    const readColors = () => {
      const styles = getComputedStyle(root);
      colors.line = hexToRgb(styles.getPropertyValue('--color-secondary'));
      colors.dot = hexToRgb(styles.getPropertyValue('--color-text'));
      colors.accent = hexToRgb(styles.getPropertyValue('--color-primary'));
    };

    const makeNode = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 16, 
      vy: (Math.random() - 0.5) * 16,
      r: 1.2 + Math.random() * 1.3,
      accent: Math.random() < 0.12,
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = hero.clientWidth;
      height = hero.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.min(MAX_NODES, Math.round((width * height) / 16000));
      while (nodes.length < target) nodes.push(makeNode());
      nodes.length = target;
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DISTANCE) {
            ctx.strokeStyle = `rgba(${colors.line},${(1 - dist / LINK_DISTANCE) * 0.3})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach((node) => {
        ctx.fillStyle = node.accent ? `rgba(${colors.accent},0.9)` : `rgba(${colors.dot},0.55)`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const step = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      nodes.forEach((node) => {
        node.x += node.vx * dt;
        node.y += node.vy * dt;
        if (node.x < -10) node.x = width + 10;
        if (node.x > width + 10) node.x = -10;
        if (node.y < -10) node.y = height + 10;
        if (node.y > height + 10) node.y = -10;
      });

      draw();
      frameId = requestAnimationFrame(step);
    };

    const start = () => {
      if (frameId || prefersReducedMotion || !heroVisible || document.hidden) return;
      lastTime = performance.now();
      frameId = requestAnimationFrame(step);
    };

    const stop = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = null;
    };

    readColors();
    resize();
    start();

    window.addEventListener('resize', resize);
    document.addEventListener('themechange', () => { readColors(); draw(); });
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        heroVisible = entry.isIntersecting;
        if (heroVisible) start(); else stop();
      }).observe(hero);
    }
  }
})();
