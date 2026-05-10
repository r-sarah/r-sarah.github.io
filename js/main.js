(function () {
  'use strict';

  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const themeToggle = document.getElementById('theme-toggle');
  const contactForm = document.getElementById('contact-form');
  const skillsTabs = document.querySelectorAll('.skills-tab');
  const skillsPanels = document.querySelectorAll('.skills-panel');
  const THEME_STORAGE_KEY = 'theme-preference';
  const LANG_STORAGE_KEY = 'lang-preference';
  const STRINGS = window.PORTFOLIO_I18N || window.PROJECT_PAGE_I18N || { fr: {}, en: {} };
  var currentLang = 'fr';

  function msg(key) {
    var pack = STRINGS[currentLang] || STRINGS.fr;
    var v = pack[key];
    if (v !== undefined && v !== '') return v;
    return STRINGS.fr[key] !== undefined ? STRINGS.fr[key] : key;
  }

  function applyLanguage(lang) {
    if (lang !== 'fr' && lang !== 'en') lang = 'fr';
    currentLang = lang;
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    document.documentElement.lang = lang;

    function t(key) {
      var pack = STRINGS[lang] || STRINGS.fr;
      var v = pack[key];
      if (v !== undefined && v !== '') return v;
      return STRINGS.fr[key] !== undefined ? STRINGS.fr[key] : '';
    }

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (!k) return;
      var val = t(k);
      if (!val) return;
      el.textContent = val;
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-html');
      if (k) el.innerHTML = t(k);
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-aria');
      if (k) el.setAttribute('aria-label', t(k));
    });

    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-alt');
      if (k) el.setAttribute('alt', t(k));
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-placeholder');
      if (k) el.setAttribute('placeholder', t(k));
    });

    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-title');
      if (k) el.setAttribute('title', t(k));
    });

    document.querySelectorAll('[data-i18n-iframe-title]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-iframe-title');
      if (k) el.setAttribute('title', t(k));
    });

    var titleEl = document.querySelector('title[data-page-title]');
    if (titleEl) titleEl.textContent = t('meta.title');
    document.title = t('meta.title');

    var langToggle = document.getElementById('lang-toggle');
    var langLabel = langToggle && langToggle.querySelector('.lang-toggle-label');
    if (langToggle && langLabel) {
      if (lang === 'fr') {
        langLabel.textContent = '';
        langLabel.className = 'lang-toggle-label lang-flag lang-flag-gb';
        langLabel.setAttribute('aria-hidden', 'true');
        langToggle.setAttribute('aria-label', t('lang.ariaToEn'));
        langToggle.setAttribute('title', t('lang.titleToEn'));
      } else {
        langLabel.textContent = '';
        langLabel.className = 'lang-toggle-label lang-flag lang-flag-fr';
        langLabel.setAttribute('aria-hidden', 'true');
        langToggle.setAttribute('aria-label', t('lang.ariaToFr'));
        langToggle.setAttribute('title', t('lang.titleToFr'));
      }
    }

    var savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    var preferredTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    applyTheme(savedTheme || preferredTheme);

    document.dispatchEvent(new CustomEvent('portfolio-i18n-applied'));
  }

  function initLanguage() {
    if (!document.getElementById('lang-toggle')) return;
    if (!window.PORTFOLIO_I18N && !window.PROJECT_PAGE_I18N) return;
    var langToggle = document.getElementById('lang-toggle');
    var saved = localStorage.getItem(LANG_STORAGE_KEY);
    applyLanguage(saved === 'en' ? 'en' : 'fr');
    langToggle.addEventListener('click', function () {
      applyLanguage(currentLang === 'fr' ? 'en' : 'fr');
    });
  }

  function applyTheme(theme) {
    const isLight = theme === 'light';
    document.body.classList.toggle('light-theme', isLight);
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(isLight));
      if (window.PORTFOLIO_I18N || window.PROJECT_PAGE_I18N) {
        themeToggle.setAttribute('aria-label', isLight ? msg('theme.toDark') : msg('theme.toLight'));
        themeToggle.setAttribute('title', msg('theme.toggle.title'));
      } else {
        themeToggle.setAttribute('aria-label', isLight ? 'Activer le mode sombre' : 'Activer le mode clair');
        themeToggle.setAttribute('title', 'Basculer le thème');
      }
      const icon = themeToggle.querySelector('.theme-toggle-icon');
      if (icon) icon.textContent = isLight ? '☀️' : '🌙';
    }
  }

  function initThemeToggle() {
    if (!themeToggle) return;
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const preferredTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    applyTheme(savedTheme || preferredTheme);

    themeToggle.addEventListener('click', function () {
      const nextTheme = document.body.classList.contains('light-theme') ? 'dark' : 'light';
      applyTheme(nextTheme);
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    });
  }

  var robotIframe = document.querySelector('.hero-robot-bg iframe');
  var splineBrandMask = document.querySelector('.spline-brand-mask');
  var ROBOT_SECTION_ORDER = ['accueil', 'apropos', 'projets', 'competences', 'contact'];
  var ROBOT_X_BY_SECTION = {
    accueil: '55%',
    apropos: '85%',
    projets: '55%',
    competences: '55%',
    contact: '30%'
  };
  var lastRobotSectionId = '';

  function getActiveSectionForRobot() {
    var offset = window.innerHeight * 0.35;
    var y = window.scrollY + offset;
    var active = 'accueil';
    for (var i = 0; i < ROBOT_SECTION_ORDER.length; i++) {
      var id = ROBOT_SECTION_ORDER[i];
      var el = document.getElementById(id);
      if (!el) continue;
      var top = el.getBoundingClientRect().top + window.scrollY;
      if (top <= y) active = id;
    }
    return active;
  }

  function updateRobotHorizontalAnchor() {
    if (!robotIframe) return;
    if (window.matchMedia('(max-width: 768px)').matches) {
      if (lastRobotSectionId !== '__mobile__') {
        lastRobotSectionId = '__mobile__';
        robotIframe.style.removeProperty('--robot-x');
      }
      return;
    }
    var id = getActiveSectionForRobot();
    if (id === lastRobotSectionId) return;
    lastRobotSectionId = id;
    var x = ROBOT_X_BY_SECTION[id];
    if (x) robotIframe.style.setProperty('--robot-x', x);
  }

  function updateSplineBrandMask() {
    if (!robotIframe || !splineBrandMask) return;
    var r = robotIframe.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    var pad = 10;
    var w = Math.min(240, Math.max(168, r.width * 0.13));
    var h = 54;
    var left = r.right - w - pad;
    var top = r.bottom - h - pad;
    left = Math.max(0, Math.min(left, window.innerWidth - w));
    top = Math.max(0, Math.min(top, window.innerHeight - h));
    splineBrandMask.style.left = Math.round(left) + 'px';
    splineBrandMask.style.top = Math.round(top) + 'px';
    splineBrandMask.style.width = Math.round(w) + 'px';
    splineBrandMask.style.height = Math.round(h) + 'px';
  }

  function tickSplineBrandMaskWhileRobotMoves() {
    var start = performance.now();
    function tick(now) {
      updateSplineBrandMask();
      if (now - start < 700) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (robotIframe && splineBrandMask) {
    robotIframe.addEventListener('transitionend', function (e) {
      if (e.propertyName === 'left') updateSplineBrandMask();
    });
  }

  function onScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    var prevSection = lastRobotSectionId;
    updateRobotHorizontalAnchor();
    if (lastRobotSectionId !== prevSection) {
      tickSplineBrandMaskWhileRobotMoves();
    }
    updateSplineBrandMask();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener(
    'resize',
    function () {
      lastRobotSectionId = '';
      updateRobotHorizontalAnchor();
      updateSplineBrandMask();
    },
    { passive: true }
  );
  onScroll();
  initLanguage();
  initThemeToggle();

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      navMenu.classList.toggle('open');
      navToggle.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('open');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  const revealEls = document.querySelectorAll(
    '.about-grid, .timeline-item, .exp-card, .skill-category, .softskill-category, .project-card, .contact-wrapper'
  );
  const observerOptions = { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0.1 };
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        setTimeout(function () { entry.target.classList.add('visible'); }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  revealEls.forEach(function (el) {
    el.classList.add('reveal');
    observer.observe(el);
  });

  if (skillsTabs.length && skillsPanels.length) {
    skillsTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        const targetId = tab.getAttribute('data-tab-target');
        if (!targetId) return;

        skillsTabs.forEach(function (btn) {
          btn.classList.remove('is-active');
          btn.setAttribute('aria-selected', 'false');
        });

        skillsPanels.forEach(function (panel) {
          panel.classList.remove('is-active');
          panel.setAttribute('hidden', '');
        });

        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          tab.classList.add('is-active');
          tab.setAttribute('aria-selected', 'true');
          targetPanel.classList.add('is-active');
          targetPanel.removeAttribute('hidden');
          if (targetId === 'skills-panel-softskills') {
            initSoftskillsStagger(targetPanel);
          }
        }
      });
    });
  }

  function initSoftskillsStagger(panel) {
    var cards = panel.querySelectorAll('.softskill-flip');
    cards.forEach(function (card, index) {
      card.style.setProperty('--stagger', String(index));
    });
  }

  (function initSoftskillsFlipCards() {
    var panel = document.getElementById('skills-panel-softskills');
    if (!panel) return;

    initSoftskillsStagger(panel);
    var cards = panel.querySelectorAll('.softskill-flip');
    if (!cards.length) return;

    function closeOthers(currentCard) {
      cards.forEach(function (card) {
        if (card === currentCard) return;
        card.classList.remove('is-flipped');
        card.setAttribute('aria-pressed', 'false');
      });
    }

    cards.forEach(function (card) {
      card.setAttribute('aria-pressed', 'false');

      card.addEventListener('click', function () {
        var willOpen = !card.classList.contains('is-flipped');
        closeOthers(card);
        card.classList.toggle('is-flipped', willOpen);
        card.setAttribute('aria-pressed', String(willOpen));
      });

      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var willOpen = !card.classList.contains('is-flipped');
          closeOthers(card);
          card.classList.toggle('is-flipped', willOpen);
          card.setAttribute('aria-pressed', String(willOpen));
        }
      });
    });

    document.addEventListener('click', function (e) {
      if (e.target.closest('#skills-panel-softskills .softskill-flip')) return;
      cards.forEach(function (card) {
        card.classList.remove('is-flipped');
        card.setAttribute('aria-pressed', 'false');
      });
    });
  })();

  (function initCertificationCards() {
    var cards = document.querySelectorAll('.certification-card');
    if (!cards.length) return;

    function setOpenCard(activeCard) {
      var hasOpenCard = false;
      cards.forEach(function (card) {
        var isOpen = card === activeCard;
        card.classList.toggle('is-open', isOpen);
        card.setAttribute('aria-expanded', String(isOpen));
        hasOpenCard = hasOpenCard || isOpen;
      });
      document.body.classList.toggle('certification-overlay-open', hasOpenCard);
    }

    cards.forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target && e.target.closest('.certification-close')) {
          setOpenCard(null);
          return;
        }
        if (card.classList.contains('is-open')) return;
        setOpenCard(card);
      });

      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (card.classList.contains('is-open')) return;
          setOpenCard(card);
        }
      });
    });

    document.querySelectorAll('.certification-close').forEach(function (closeBtn) {
      closeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        setOpenCard(null);
      });
    });
  })();

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = contactForm.querySelector('button[type="submit"]');
      var text = btn.textContent;
      btn.textContent =
        window.PORTFOLIO_I18N || window.PROJECT_PAGE_I18N ? msg('contact.sent') : 'Envoyé !';
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = text;
        btn.disabled = false;
        contactForm.reset();
      }, 2500);
    });
  }

  (function initContactEmailCopy() {
    var btn = document.querySelector('.contact-email-copy');
    if (!btn) return;
    var textSpan = btn.querySelector('.contact-email-text');
    if (!textSpan) return;
    var email = btn.getAttribute('data-email');
    if (!email) return;
    var originalLabel = textSpan.textContent;
    var feedbackTimer = null;

    function fallbackCopy(str) {
      var ta = document.createElement('textarea');
      ta.value = str;
      ta.setAttribute('readonly', '');
      ta.setAttribute('aria-hidden', 'true');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch (err) {}
      document.body.removeChild(ta);
    }

    function showCopied() {
      if (feedbackTimer) clearTimeout(feedbackTimer);
      textSpan.textContent =
        window.PORTFOLIO_I18N || window.PROJECT_PAGE_I18N ? msg('contact.copied') : 'Copié !';
      feedbackTimer = setTimeout(function () {
        textSpan.textContent = originalLabel;
        feedbackTimer = null;
      }, 2000);
    }

    btn.addEventListener('click', function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(showCopied).catch(function () {
          fallbackCopy(email);
          showCopied();
        });
      } else {
        fallbackCopy(email);
        showCopied();
      }
    });
  })();

  /* Compteurs dynamiques — cartes Impact (Intersection Observer) */
  (function initImpactCountUps() {
    if (typeof IntersectionObserver === 'undefined') return;

    var reduceMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function formatDisplay(value, decimals) {
      if (decimals > 0) {
        return value.toFixed(decimals).replace('.', ',');
      }
      var n = Math.round(value);
      var str = String(Math.abs(n));
      var formatted = str.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      return n < 0 ? '-' + formatted : formatted;
    }

    function getAutoDuration(target) {
      var absTarget = Math.abs(target);
      if (absTarget <= 10) return 5200;
      if (absTarget <= 50) return 4600;
      if (absTarget <= 100) return 3800;
      if (absTarget <= 500) return 3000;
      return 2400;
    }

    function runCountUp(el) {
      var raw = el.getAttribute('data-target');
      var target = raw === null ? NaN : parseFloat(raw, 10);
      if (isNaN(target)) return;
      var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      var durationAttr = parseInt(el.getAttribute('data-duration') || '', 10);
      var duration = !isNaN(durationAttr) ? durationAttr : getAutoDuration(target);

      if (reduceMotion) {
        el.textContent = formatDisplay(target, decimals);
        return;
      }

      el.classList.add('is-counting');
      var start = performance.now();
      function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
      }
      function tick(now) {
        var progress = Math.min(1, (now - start) / duration);
        var eased = easeOutCubic(progress);
        var current = eased * target;
        el.textContent = formatDisplay(current, decimals);
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = formatDisplay(target, decimals);
          el.classList.remove('is-counting');
        }
      }
      requestAnimationFrame(tick);
    }

    var io = null;

    function bindProjectCountUps() {
      var counters = document.querySelectorAll('.project-detail--premium .count-up');
      if (!counters.length) return;

      if (io) io.disconnect();

      io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var el = entry.target;
            io.unobserve(el);
            var extra = parseInt(el.getAttribute('data-stagger') || '', 10);
            var stagger = !isNaN(extra) ? extra : 0;
            setTimeout(function () {
              runCountUp(el);
            }, stagger);
          });
        },
        { root: null, rootMargin: '0px', threshold: 0.55 }
      );

      counters.forEach(function (el) {
        io.observe(el);
      });
    }

    bindProjectCountUps();
    document.addEventListener('portfolio-i18n-applied', bindProjectCountUps);
  })();

  /* Tilt 3D — bloc Capture projet (pages projet premium) */
  (function initHeroCaptureTilt() {
    var captures = document.querySelectorAll('.project-hero-premium-capture');
    if (!captures.length) return;

    var reduceMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    var maxDeg = 9;
    var translateZ = 14;

    captures.forEach(function (el) {
      function setTilt(e) {
        var r = el.getBoundingClientRect();
        var w = r.width || 1;
        var h = r.height || 1;
        var px = (e.clientX - r.left) / w;
        var py = (e.clientY - r.top) / h;
        px = Math.max(0, Math.min(1, px));
        py = Math.max(0, Math.min(1, py));
        var ry = (px - 0.5) * 2 * maxDeg;
        var rx = -(py - 0.5) * 2 * maxDeg;
        el.classList.add('project-hero-premium-capture--tilting');
        el.style.transform =
          'rotateX(' +
          rx.toFixed(2) +
          'deg) rotateY(' +
          ry.toFixed(2) +
          'deg) translateZ(' +
          translateZ +
          'px)';
      }

      function resetTilt() {
        el.classList.remove('project-hero-premium-capture--tilting');
        el.style.transform = '';
      }

      el.addEventListener('mousemove', setTilt);
      el.addEventListener('mouseleave', resetTilt);
    });
  })();

  /* Pulse de bordure au clic (cartes, boutons, capture projet) */
  (function initClickInteractionFeedback() {
    var selector = [
      '.btn',
      'button:not(#nav-toggle):not(#lang-toggle)',
      '.project-card-link',
      '.project-premium-card',
      '.bento-card',
      '.tech-badge-premium',
      '.highlight-card',
      '.exp-card',
      '.skill-category',
      '.skills-tab',
      '.project-hero-premium-capture'
    ].join(',');

    document.body.addEventListener(
      'click',
      function (e) {
        var el = e.target.closest(selector);
        if (!el) return;
        if (e.target.closest('#nav-toggle')) return;
        if (e.target.closest('#lang-toggle')) return;

        if (el._uiFeedbackTimer) clearTimeout(el._uiFeedbackTimer);
        el.classList.remove('ui-interaction-active');
        void el.offsetWidth;
        el.classList.add('ui-interaction-active');
        var ms =
          window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 180
            : 420;
        el._uiFeedbackTimer = setTimeout(function () {
          el.classList.remove('ui-interaction-active');
          el._uiFeedbackTimer = null;
        }, ms);
      },
      false
    );
  })();
})();
