(function () {
  const LOAD_TIMEOUT_MS = 3500;

  function buildActionLink(className, href, text, download) {
    const link = document.createElement('a');
    link.className = className;
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = text;
    if (download) {
      link.setAttribute('download', '');
    }
    return link;
  }

  function ensureActions(shell) {
    let actions = shell.querySelector('.embed-actions');
    if (!actions) {
      actions = document.createElement('div');
      actions.className = 'embed-actions';
      shell.appendChild(actions);
    } else {
      actions.innerHTML = '';
    }
    const openUrl = shell.dataset.open || shell.dataset.src || '#';
    actions.appendChild(buildActionLink('embed-open btn-secondary btn-sm', openUrl, 'Open in new tab'));

    if (shell.dataset.download) {
      actions.appendChild(buildActionLink('embed-download btn-secondary btn-sm', shell.dataset.download, 'Download', true));
    }
    return actions;
  }

  function loadEmbed(shell) {
    if (!shell || shell.dataset.loaded === 'true') return;
    shell.dataset.loaded = 'true';

    const placeholder = shell.querySelector('.embed-placeholder');
    if (placeholder) {
      placeholder.hidden = true;
    }

    const kind = shell.dataset.kind || 'Preview';
    const iframe = document.createElement('iframe');
    iframe.src = shell.dataset.src;
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer';
    iframe.allow = kind === 'Video' ? 'autoplay; fullscreen' : '';
    iframe.setAttribute('title', `${kind} preview`);
    iframe.className = 'embed-iframe';

    shell.prepend(iframe);
    ensureActions(shell);

    let loaded = false;
    const timeout = window.setTimeout(() => {
      if (!loaded) {
        shell.classList.add('embed-failed');
      }
    }, LOAD_TIMEOUT_MS);

    iframe.addEventListener('load', () => {
      loaded = true;
      window.clearTimeout(timeout);
      shell.classList.remove('embed-failed');
    });

    iframe.addEventListener('error', () => {
      loaded = false;
      window.clearTimeout(timeout);
      shell.classList.add('embed-failed');
    });
  }

  function observeEmbeds() {
    const shells = Array.from(document.querySelectorAll('.embed-shell'));
    if (!shells.length) return;

    if (!('IntersectionObserver' in window)) {
      shells.forEach((shell) => loadEmbed(shell));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadEmbed(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '400px 0px' }
    );

    shells.forEach((shell) => observer.observe(shell));
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('.embed-load');
    if (!button) return;
    const shell = button.closest('.embed-shell');
    if (shell) {
      loadEmbed(shell);
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    observeEmbeds();
  });
})();
