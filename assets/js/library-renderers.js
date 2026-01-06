(function () {
  const data = window.LIP_LIBRARY || {};
  const lightbox = window.LIP_LIGHTBOX;

  function resolve(path, encode = false) {
    if (!data.withBase) return path;
    return data.withBase(path, { encode });
  }

  function openInLightbox({ type, src, title, poster }) {
    if (lightbox && typeof lightbox.open === 'function') {
      lightbox.open({ type, src, title, poster });
    } else if (src) {
      window.open(src, '_blank', 'noopener');
    }
  }

  function buildStyleCard(style) {
    const article = document.createElement('article');
    article.className = 'style-card library-card';

    const media = document.createElement('div');
    media.className = 'style-media';

    const mediaButton = document.createElement('button');
    mediaButton.type = 'button';
    mediaButton.className = 'style-preview-link';
    mediaButton.setAttribute('aria-label', `Open ${style.title} preview`);

    const img = document.createElement('img');
    img.src = style.resolvedImage || resolve(style.imagePath, true);
    img.alt = style.title;
    img.loading = 'lazy';
    img.className = 'style-preview';

    const fallback = document.createElement('div');
    fallback.className = 'style-fallback hidden';
    fallback.textContent = style.badge || style.title;

    img.addEventListener('error', () => {
      img.classList.add('hidden');
      fallback.classList.remove('hidden');
    });

    mediaButton.addEventListener('click', () =>
      openInLightbox({ type: 'image', src: style.resolvedImage || resolve(style.imagePath, true), title: style.title })
    );

    mediaButton.append(img, fallback);
    media.appendChild(mediaButton);

    const body = document.createElement('div');
    body.className = 'style-card__body';

    const title = document.createElement('p');
    title.className = 'style-card__title';
    title.textContent = style.title;

    const desc = document.createElement('p');
    desc.className = 'style-card__desc';
    desc.textContent = style.description;

    const actions = document.createElement('div');
    actions.className = 'library-actions';

    const previewBtn = document.createElement('button');
    previewBtn.type = 'button';
    previewBtn.className = 'btn-secondary btn-sm';
    previewBtn.textContent = 'Preview';
    previewBtn.addEventListener('click', () =>
      openInLightbox({ type: 'image', src: style.resolvedImage || resolve(style.imagePath, true), title: style.title })
    );

    const openLink = document.createElement('a');
    openLink.href = style.resolvedImage || resolve(style.imagePath, true);
    openLink.target = '_blank';
    openLink.rel = 'noopener';
    openLink.className = 'btn-primary btn-sm';
    openLink.textContent = 'Open';

    actions.append(previewBtn, openLink);
    body.append(title, desc, actions);
    article.append(media, body);
    return article;
  }

  function renderStyles() {
    const nodes = document.querySelectorAll('[data-style-grid]');
    if (!nodes.length || !Array.isArray(data.styles)) return;
    nodes.forEach((grid) => {
      grid.innerHTML = '';
      data.styles.forEach((style) => {
        const card = buildStyleCard(style);
        grid.appendChild(card);
      });
    });
  }

  function buildVideoCard(video) {
    const article = document.createElement('article');
    article.className = 'resource-card media-card';

    const previewWrap = document.createElement('div');
    previewWrap.className = 'resource-preview';

    const videoEl = document.createElement('video');
    videoEl.src = video.resolvedFile || resolve(video.filePath, true);
    videoEl.controls = true;
    videoEl.preload = 'metadata';
    videoEl.playsInline = true;
    videoEl.className = 'media-thumb__video';
    if (video.resolvedPoster || video.poster) {
      videoEl.poster = video.resolvedPoster || resolve(video.poster, true);
    }

    const fallback = document.createElement('div');
    fallback.className = 'resource-fallback hidden';
    fallback.textContent = 'Video file missing. Update the path in assets/js/library-data.js.';

    videoEl.addEventListener('error', () => {
      fallback.classList.remove('hidden');
      previewWrap.classList.add('resource-preview--fallback');
    });

    previewWrap.append(videoEl, fallback);

    const body = document.createElement('div');
    body.className = 'resource-card__body';

    const title = document.createElement('h3');
    title.className = 'resource-card__title';
    title.textContent = video.title;

    const desc = document.createElement('p');
    desc.className = 'resource-card__subtitle';
    desc.textContent = video.description;

    const badge = document.createElement('span');
    badge.className = 'badge badge-muted';
    badge.textContent = video.badge || 'Video';

    const actions = document.createElement('div');
    actions.className = 'resource-card__actions';

    const previewBtn = document.createElement('button');
    previewBtn.type = 'button';
    previewBtn.className = 'btn-secondary btn-sm';
    previewBtn.textContent = 'Preview';
    previewBtn.addEventListener('click', () =>
      openInLightbox({
        type: 'video',
        src: video.resolvedFile || resolve(video.filePath, true),
        title: video.title,
        poster: video.resolvedPoster || resolve(video.poster, true),
      })
    );

    const openLink = document.createElement('a');
    openLink.href = video.resolvedFile || resolve(video.filePath, true);
    openLink.target = '_blank';
    openLink.rel = 'noopener';
    openLink.className = 'btn-primary btn-sm';
    openLink.textContent = 'Open';

    actions.append(previewBtn, openLink);
    body.append(title, desc, badge, actions);
    article.append(previewWrap, body);
    return article;
  }

  function renderVideos() {
    const container = document.querySelector('[data-video-grid]');
    if (!container || !Array.isArray(data.videos)) return;
    container.innerHTML = '';
    data.videos.forEach((video) => {
      const card = buildVideoCard(video);
      container.appendChild(card);
    });
  }

  function buildPdfCard(pdf) {
    const article = document.createElement('article');
    article.className = 'resource-card media-card';

    const previewWrap = document.createElement('div');
    previewWrap.className = 'resource-preview';

    const iframe = document.createElement('iframe');
    iframe.src = `${pdf.resolvedFile || resolve(pdf.filePath, true)}#view=FitH`;
    iframe.loading = 'lazy';
    iframe.title = `${pdf.title} preview`;
    iframe.className = 'media-thumb__pdf';

    const fallback = document.createElement('div');
    fallback.className = 'resource-fallback hidden';
    fallback.textContent = 'PDF preview unavailable. Use Open or update the path in assets/js/library-data.js.';

    iframe.addEventListener('error', () => {
      fallback.classList.remove('hidden');
      previewWrap.classList.add('resource-preview--fallback');
    });

    previewWrap.append(iframe, fallback);

    const body = document.createElement('div');
    body.className = 'resource-card__body';

    const title = document.createElement('h3');
    title.className = 'resource-card__title';
    title.textContent = pdf.title;

    const desc = document.createElement('p');
    desc.className = 'resource-card__subtitle';
    desc.textContent = pdf.description;

    const badge = document.createElement('span');
    badge.className = 'badge badge-muted';
    badge.textContent = pdf.badge || 'PDF';

    const actions = document.createElement('div');
    actions.className = 'resource-card__actions';

    const previewBtn = document.createElement('button');
    previewBtn.type = 'button';
    previewBtn.className = 'btn-secondary btn-sm';
    previewBtn.textContent = 'Preview';
    previewBtn.addEventListener('click', () =>
      openInLightbox({ type: 'pdf', src: pdf.resolvedFile || resolve(pdf.filePath, true), title: pdf.title })
    );

    const openLink = document.createElement('a');
    openLink.href = pdf.resolvedFile || resolve(pdf.filePath, true);
    openLink.target = '_blank';
    openLink.rel = 'noopener';
    openLink.className = 'btn-primary btn-sm';
    openLink.textContent = 'Open';

    actions.append(previewBtn, openLink);
    body.append(title, desc, badge, actions);
    article.append(previewWrap, body);
    return article;
  }

  function renderPdfs() {
    const container = document.querySelector('[data-pdf-grid]');
    if (!container || !Array.isArray(data.pdfs)) return;
    container.innerHTML = '';
    data.pdfs.forEach((pdf) => {
      const card = buildPdfCard(pdf);
      container.appendChild(card);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderStyles();
    renderVideos();
    renderPdfs();
  });
})();
