(function () {
  const basePath = detectBasePath();

  function detectBasePath() {
    const meta = document.querySelector('meta[name="base-path"]');
    const metaPath = meta?.content?.trim() || '';
    const windowPath = typeof window !== 'undefined' ? window.__BASE_PATH__ : '';
    const chosen = metaPath || windowPath || '';
    return chosen.replace(/\/$/, '');
  }

  function withBase(path) {
    if (!path) return path;
    if (/^(https?:)?\/\//i.test(path)) return path;
    if (path.startsWith('/')) {
      return `${basePath}${path}`;
    }
    return path;
  }

  function rewriteBaseLinks() {
    const elements = document.querySelectorAll('[data-base="1"]');
    elements.forEach((el) => {
      const attr = el.hasAttribute('href')
        ? 'href'
        : el.hasAttribute('src')
        ? 'src'
        : el.hasAttribute('content')
        ? 'content'
        : null;
      if (!attr) return;
      const val = el.getAttribute(attr);
      if (!val) return;
      const updated = withBase(val);
      el.setAttribute(attr, updated);
    });
  }

  function setupMobileNav() {
    const toggle = document.getElementById('mobile-toggle');
    const panel = document.getElementById('mobile-panel');
    if (!toggle || !panel) return;

    const links = panel.querySelectorAll('a');
    const backdrop = document.getElementById('mobile-backdrop');
    const resetMenu = () => {
      panel.classList.add('hidden');
      toggle.setAttribute('aria-expanded', 'false');
      backdrop?.classList.remove('active');
      backdrop?.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-open');
    };
    const closePanel = () => {
      panel.classList.add('hidden');
      toggle.setAttribute('aria-expanded', 'false');
      backdrop?.classList.remove('active');
      backdrop?.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-open');
    };
    const openPanel = () => {
      panel.classList.remove('hidden');
      toggle.setAttribute('aria-expanded', 'true');
      backdrop?.classList.add('active');
      backdrop?.setAttribute('aria-hidden', 'false');
      document.body.classList.add('menu-open');
    };

    toggle.addEventListener('click', () => {
      const isHidden = panel.classList.contains('hidden');
      if (isHidden) {
        openPanel();
      } else {
        closePanel();
      }
    });

    links.forEach((link) => {
      link.addEventListener('click', () => closePanel());
    });

    document.addEventListener('click', (event) => {
      if (panel.classList.contains('hidden')) return;
      const target = event.target;
      if (panel.contains(target) || toggle.contains(target)) return;
      closePanel();
    });

    backdrop?.addEventListener('click', () => closePanel());

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 640) {
        closePanel();
      }
    });

    resetMenu();

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closePanel();
      }
    });
  }

  function setupSmoothScroll() {
    const getHashTarget = (href) => {
      if (!href || !href.includes('#')) return null;
      const hash = href.slice(href.indexOf('#'));
      return hash.length > 1 ? hash : null;
    };

    document.querySelectorAll('a[href*="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const targetHash = getHashTarget(link.getAttribute('href'));
        if (!targetHash) return;
        const resolved = new URL(link.getAttribute('href'), window.location.href);
        if (resolved.pathname !== window.location.pathname) return;
        const target = document.querySelector(targetHash);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  function setupActiveLinks() {
    const links = Array.from(document.querySelectorAll('[data-nav-link]'));
    if (!links.length) return;
    const ids = Array.from(
      new Set(
        links
          .map((link) => link.getAttribute('data-nav-link'))
          .filter(Boolean)
      )
    );

    const sections = Array.from(
      ids
        .map((id) => document.getElementById(id))
        .filter(Boolean)
    ).sort((a, b) => a.offsetTop - b.offsetTop);

    const setActive = (id) => {
      links.forEach((link) => {
        const matches = link.getAttribute('data-nav-link') === id;
        link.classList.toggle('active', matches);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0.2 }
    );

    sections.forEach((section) => observer.observe(section));
    if (sections[0]) setActive(sections[0].id);
  }

  function setupMailto() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="name"]').value.trim();
      const org = form.querySelector('[name="organization"]').value.trim();
      const role = form.querySelector('[name="role"]').value.trim();
      const email = form.querySelector('[name="email"]').value.trim();
      const message = form.querySelector('[name="message"]').value.trim();

      const subject = encodeURIComponent(`Pilot request: ${name || 'LIP'}`);
      const bodyParts = [
        name ? `Name: ${name}` : '',
        org ? `Organization: ${org}` : '',
        role ? `Role: ${role}` : '',
        email ? `Email: ${email}` : '',
        message ? `Message:\n${message}` : '',
      ].filter(Boolean);

      const mailto = `mailto:ai.visionary.pioneer@gmail.com?subject=${subject}&body=${encodeURIComponent(bodyParts.join('\n'))}`;
      window.location.href = mailto;
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    rewriteBaseLinks();
    setupMobileNav();
    setupSmoothScroll();
    setupActiveLinks();
    setupMailto();
  });
})();
