(function () {
  const pathUtils = window.LIP_PATHS || {};
  const normalizeAssetUrl = pathUtils.normalizeAssetUrl || ((path) => path);
  const BASE_PATH = detectBasePath();

  const DRIVE_LINKS = [
    {
      type: 'video',
      title: 'Animated Explainers (Pilot) – Overview',
      subtitle: 'Google Drive preview of the animated explainers walkthrough.',
      href: 'https://drive.google.com/file/d/1AAT0PYvaKpkr4Bntf9jOa-PI0eQXXw-8/view?usp=sharing',
    },
    {
      type: 'video',
      title: 'Source-Bound Lesson Clarity – Video',
      subtitle: 'Drive-hosted overview video for the “Source-Bound Lesson Clarity” concept.',
      href: 'https://drive.google.com/file/d/1Fm7M7XXIYTBW-UBI9UgXyy4ZhEyZhCJa/view?usp=sharing',
    },
  ];

  const PDF_ITEMS = [
    {
      type: 'pdf',
      title: 'Science Concept Animation Pilot',
      subtitle: 'Example pilot deck for a science concept animation.',
      href: '/lip-site/assets/docs/Science_Concept_Animation_Pilot.pdf',
    },
    {
      type: 'pdf',
      title: 'Curriculum Amplified — Teacher Time Saved',
      subtitle: 'Slide deck PDF for the “Curriculum Amplified / Teacher Time Saved” concept.',
      href: '/lip-site/assets/docs/Curriculum_Amplified_Teacher_Time_Saved.pdf',
    },
    {
      type: 'pdf',
      title: 'Source-Bound Lesson Clarity',
      subtitle: 'Slide deck PDF explaining the “Source-Bound Lesson Clarity” concept.',
      href: '/lip-site/assets/docs/Source_Bound_Lesson_Clarity.pdf',
    },
    {
      type: 'pdf',
      title: 'LIP Pilot Snapshot',
      subtitle: 'At-a-glance PDF for the Lesson Intelligence Packs pilot.',
      href: '/lip-site/assets/docs/LIP_Pilot_Snapshot.pdf',
    },
    {
      type: 'pdf',
      title: 'Animated Explainers Pilot – What This Includes',
      subtitle: 'Breakdown of the animated explainers pilot deliverables.',
      href: '/lip-site/assets/docs/Animated_Explainers_Pilot_What_This_Includes.pdf',
    },
    {
      type: 'pdf',
      title: 'LIP Sample Frames Guide',
      subtitle: 'Reference frames and guidance for LIP visuals.',
      href: '/lip-site/assets/docs/LIP_Sample_Frames_Guide.pdf',
    },
    {
      type: 'pdf',
      title: 'LIP Style Menu',
      subtitle: 'Menu of visual style directions for Lesson Intelligence Packs.',
      href: '/lip-site/assets/docs/LIP_Style_Menu.pdf',
    },
    {
      type: 'pdf',
      title: 'LIP Short FAQ',
      subtitle: 'Quick answers to common questions about LIP.',
      href: '/lip-site/assets/docs/LIP_Short_FAQ.pdf',
    },
  ];

  const ITEMS = [...DRIVE_LINKS, ...PDF_ITEMS].map((item) => {
    const normalizedHref = normalizeAssetUrl(withBase(item.href));
    const previewSrc =
      item.type === 'video'
        ? normalizeAssetUrl(drivePreview(item.href))
        : `${normalizedHref}#view=FitH`;
    return {
      ...item,
      href: normalizedHref,
      previewSrc,
    };
  });

  const grid = document.getElementById('resource-grid');
  const modal = document.getElementById('resource-modal');
  if (!grid || !modal) return;

  const modalBody = modal.querySelector('[data-resource-modal-body]');
  const modalTitle = modal.querySelector('[data-resource-modal-title]');
  const modalSubtitle = modal.querySelector('[data-resource-modal-subtitle]');
  const modalOpenLink = modal.querySelector('[data-resource-modal-open]');
  const modalCloseButton = modal.querySelector('[data-resource-modal-close]');
  const modalOverlay = modal.querySelector('[data-resource-modal-overlay]');

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
      return `${BASE_PATH}${path}`;
    }
    return path;
  }

  function drivePreview(url) {
    const match = url.match(/\\/d\\/([^/]+)\\/view/);
    if (!match) return url;
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }

  function buildPreviewFrame(item) {
    const wrapper = document.createElement('div');
    wrapper.className = 'resource-preview';

    const iframe = document.createElement('iframe');
    iframe.src = item.previewSrc;
    iframe.loading = 'lazy';
    iframe.title = `${item.title} preview`;
    iframe.setAttribute('allowfullscreen', 'true');

    const fallback = document.createElement('div');
    fallback.className = 'resource-fallback hidden';
    const fallbackLink = document.createElement('a');
    fallbackLink.href = item.href;
    fallbackLink.target = '_blank';
    fallbackLink.rel = 'noopener';
    fallbackLink.className = 'btn-secondary btn-sm';
    fallbackLink.textContent = item.type === 'pdf' ? 'Open PDF' : 'Open video';
    fallback.appendChild(fallbackLink);

    iframe.addEventListener('error', () => {
      fallback.classList.remove('hidden');
      wrapper.classList.add('resource-preview--fallback');
    });

    wrapper.append(iframe, fallback);
    return wrapper;
  }

  function buildCard(item) {
    const article = document.createElement('article');
    article.className = 'resource-card';

    const preview = buildPreviewFrame(item);

    const body = document.createElement('div');
    body.className = 'resource-card__body';

    const h3 = document.createElement('h3');
    h3.className = 'resource-card__title';
    h3.textContent = item.title;

    const subtitle = document.createElement('p');
    subtitle.className = 'resource-card__subtitle';
    subtitle.textContent = item.subtitle;

    const badge = document.createElement('span');
    badge.className = 'badge badge-muted';
    badge.textContent = item.type === 'video' ? 'Video' : 'PDF';

    const actions = document.createElement('div');
    actions.className = 'resource-card__actions';

    const previewBtn = document.createElement('button');
    previewBtn.type = 'button';
    previewBtn.className = 'btn-secondary btn-sm';
    previewBtn.textContent = 'Preview';
    previewBtn.addEventListener('click', () => openModal(item));

    const openLink = document.createElement('a');
    openLink.href = item.href;
    openLink.target = '_blank';
    openLink.rel = 'noopener';
    openLink.className = 'btn-primary btn-sm';
    openLink.textContent = 'Open';

    actions.append(previewBtn, openLink);

    body.append(h3, subtitle, badge, actions);
    article.append(preview, body);
    return article;
  }

  function openModal(item) {
    if (!modalBody || !modalTitle || !modalSubtitle || !modalOpenLink) return;
    modalBody.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.src = item.previewSrc;
    iframe.loading = 'lazy';
    iframe.title = `${item.title} preview`;
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.className = 'resource-modal__iframe';

    modalBody.appendChild(iframe);
    modalTitle.textContent = item.title;
    modalSubtitle.textContent = item.subtitle;
    modalOpenLink.href = item.href;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    modalBody.innerHTML = '';
    document.body.classList.remove('no-scroll');
  }

  modalOverlay?.addEventListener('click', closeModal);
  modalCloseButton?.addEventListener('click', closeModal);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  ITEMS.forEach((item) => {
    const card = buildCard(item);
    grid.appendChild(card);
  });
})();
