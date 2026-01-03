(function () {
  const BASE = getBaseHref();

  // Upload these PNGs to assets/infographics/ using the exact filenames below.
  const ITEMS = [
    {
      file: 'lip-infographic-01-what-is-lip.png',
      title: 'What is a Lesson Intelligence Pack (LIP)?',
      description: 'A quick visual overview of the pilot pack and the 3-step flow.',
      aspect: '16/9',
    },
    {
      file: 'lip-infographic-02-whats-inside-lip.png',
      title: 'What’s inside a LIP (Quadrants)?',
      description: 'A four-quadrant breakdown of pack components and usage.',
      aspect: '3/4',
    },
    {
      file: 'lip-infographic-03-animated-explainers-at-a-glance.png',
      title: 'Animated Explainers (Pilot) — At a Glance',
      description: 'Snapshot of the explainer workflow, formats, and checkpoints.',
      aspect: '16/9',
    },
  ];

  const grid = document.getElementById('infographics-grid');
  if (!grid) return;

  function buildCard(item) {
    const fullSrc = `${BASE}assets/infographics/${item.file}`;
    const article = document.createElement('article');
    article.className = 'section-card infographic-card';

    const thumbLink = document.createElement('a');
    thumbLink.href = fullSrc;
    thumbLink.target = '_blank';
    thumbLink.rel = 'noopener';
    thumbLink.className = 'infographic-thumb-link';
    thumbLink.setAttribute('aria-label', `Open ${item.title} in a new tab`);

    const thumb = document.createElement('div');
    thumb.className = 'infographic-thumb';
    thumb.dataset.aspect = item.aspect || '16/9';

    const img = document.createElement('img');
    img.src = fullSrc;
    img.alt = item.title;
    img.loading = 'lazy';
    img.addEventListener('error', () => renderPlaceholder(thumb, item.title));
    thumb.appendChild(img);
    thumbLink.appendChild(thumb);

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

    const openLink = document.createElement('a');
    openLink.href = fullSrc;
    openLink.target = '_blank';
    openLink.rel = 'noopener';
    openLink.className = 'btn-primary text-xs';
    openLink.textContent = 'Open';

    footer.append(badge, openLink);

    article.append(thumbLink, textWrap, footer);
    return article;
  }

  function getBaseHref() {
    const baseEl = document.querySelector('base');
    const href = baseEl?.getAttribute('href') || (location.pathname.startsWith('/lip-site/') ? '/lip-site/' : '/');
    return href.endsWith('/') ? href : `${href}/`;
  }

  function renderPlaceholder(container, title) {
    container.classList.add('is-missing');
    container.innerHTML = '';

    const placeholder = document.createElement('div');
    placeholder.className = 'infographic-thumb__placeholder';
    placeholder.setAttribute('role', 'img');
    placeholder.setAttribute('aria-label', `${title} missing file`);

    placeholder.innerHTML = `
      <svg aria-hidden="true" focusable="false" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"></rect>
        <path d="M3 16l5-5 4 4 5-5 4 4"></path>
        <path d="M3 7h4"></path>
      </svg>
      <span>Missing file</span>
    `;

    container.appendChild(placeholder);
  }

  ITEMS.forEach((item) => {
    const card = buildCard(item);
    grid.appendChild(card);
  });
})();
