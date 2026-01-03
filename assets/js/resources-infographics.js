(function () {
  const BASE = location.pathname.startsWith('/lip-site/') ? '/lip-site/' : '/';

  const ITEMS = [
    {
      file: 'lip-infographic-01-what-is-lip.png',
      title: 'Pilot Pack (Cartoon)',
      description: 'High-level cartoon treatment for the pilot kit explainer.',
    },
    {
      file: 'lip-infographic-02-whats-inside-lip.png',
      title: 'LIP Quadrants (Neon)',
      description: 'Four-quadrant neon style to spotlight learning modes and use cases.',
    },
    {
      file: 'lip-infographic-03-animated-explainers-pilot.png',
      title: 'Animated Explainers at a Glance',
      description: 'Snapshot of the animated explainer workflow and checkpoints.',
    },
  ];

  const grid = document.getElementById('infographics-grid');
  if (!grid) return;

  function buildCard(item) {
    const fullSrc = `${BASE}assets/infographics/${item.file}`;
    const article = document.createElement('article');
    article.className = 'section-card infographic-card';

    const thumb = document.createElement('button');
    thumb.type = 'button';
    thumb.className = 'infographic-thumb thumb-button';
    thumb.setAttribute('aria-label', `Open ${item.title}`);
    thumb.addEventListener('click', () => openModal(fullSrc, item.title));

    const img = document.createElement('img');
    img.src = fullSrc;
    img.alt = item.title;
    img.loading = 'lazy';
    thumb.appendChild(img);

    const textWrap = document.createElement('div');
    textWrap.className = 'space-y-2';

    const h3 = document.createElement('h3');
    h3.className = 'font-semibold text-slate-900';
    h3.textContent = item.title;

    const desc = document.createElement('p');
    desc.className = 'text-sm text-slate-600';
    desc.textContent = item.description;

    textWrap.append(h3, desc);

    const footer = document.createElement('div');
    footer.className = 'flex justify-between items-center';

    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = 'PNG';

    const openLink = document.createElement('button');
    openLink.type = 'button';
    openLink.className = 'btn-primary text-xs';
    openLink.textContent = 'Open';
    openLink.addEventListener('click', () => openModal(fullSrc, item.title));

    footer.append(badge, openLink);

    article.append(thumb, textWrap, footer);
    return article;
  }

  function ensureModal() {
    let modal = document.getElementById('infographic-modal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'infographic-modal';
    modal.className = 'infographic-modal hidden';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Infographic preview');

    const overlay = document.createElement('div');
    overlay.className = 'infographic-modal__overlay';

    const dialog = document.createElement('div');
    dialog.className = 'infographic-modal__dialog';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'infographic-modal__close';
    closeBtn.setAttribute('aria-label', 'Close preview');
    closeBtn.innerHTML = '&times;';

    const image = document.createElement('img');
    image.alt = '';
    image.loading = 'lazy';
    image.className = 'infographic-modal__image';

    const title = document.createElement('p');
    title.className = 'infographic-modal__title';

    dialog.append(closeBtn, image, title);
    modal.append(overlay, dialog);
    document.body.appendChild(modal);

    const closeModal = () => {
      modal.classList.add('hidden');
      document.body.classList.remove('modal-open');
    };

    overlay.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });

    modal.closeModal = closeModal;
    modal.imageEl = image;
    modal.titleEl = title;
    return modal;
  }

  function openModal(src, title) {
    const modal = ensureModal();
    modal.imageEl.src = src;
    modal.imageEl.alt = title;
    modal.titleEl.textContent = title;
    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
  }

  ITEMS.forEach((item) => {
    const card = buildCard(item);
    grid.appendChild(card);
  });
})();
