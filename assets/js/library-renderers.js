(function () {
  const data = window.LIP_LIBRARY || {};
  const lightbox = window.LIP_LIGHTBOX;
  const pathUtils = window.LIP_PATHS || {};

  const toSiteUrl = pathUtils.toSiteUrl || pathUtils.buildUrl || pathUtils.withBase || ((v) => v);

  function resolve(path, encode = false) {
    if (typeof toSiteUrl === 'function') return toSiteUrl(path, { encode });
    return path;
  }

  function openInLightbox({ type, src, title, poster, openUrl }) {
    if (lightbox && typeof lightbox.open === 'function') {
      lightbox.open({ type, src, title, poster, openUrl });
    } else if (src) {
      window.open(openUrl || src, '_blank', 'noopener');
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
    previewWrap.className = 'resource-preview video-preview';

    const iframe = document.createElement('iframe');
    iframe.src = video.embedUrl || video.shareUrl;
    iframe.loading = 'lazy';
    iframe.title = `${video.title} preview`;
    iframe.allow = 'autoplay; fullscreen';
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('tabindex', '-1');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.className = 'media-thumb__frame';

    const overlayButton = document.createElement('button');
    overlayButton.type = 'button';
    overlayButton.className = 'media-thumb__overlay';
    overlayButton.setAttribute('aria-label', `Open ${video.title} preview`);

    const fallback = document.createElement('div');
    fallback.className = 'resource-fallback resource-fallback--stack hidden';

    const fallbackText = document.createElement('p');
    fallbackText.className = 'resource-fallback__text';
    fallbackText.textContent = 'Video preview unavailable.';

    const fallbackBtn = document.createElement('button');
    fallbackBtn.type = 'button';
    fallbackBtn.className = 'btn-primary btn-sm';
    fallbackBtn.textContent = 'Open video';
    fallbackBtn.addEventListener('click', () =>
      openInLightbox({
        type: 'video',
        src: video.embedUrl || video.shareUrl,
        title: video.title,
        poster: video.resolvedPoster || resolve(video.poster, true),
        openUrl: video.shareUrl || video.embedUrl,
      })
    );

    overlayButton.addEventListener('click', () =>
      openInLightbox({
        type: 'video',
        src: video.embedUrl || video.shareUrl,
        title: video.title,
        poster: video.resolvedPoster || resolve(video.poster, true),
        openUrl: video.shareUrl || video.embedUrl,
      })
    );

    fallback.append(fallbackText, fallbackBtn);

    iframe.addEventListener('error', () => {
      fallback.classList.remove('hidden');
      previewWrap.classList.add('resource-preview--fallback');
    });

    previewWrap.append(iframe, overlayButton, fallback);

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
        src: video.embedUrl || video.shareUrl,
        title: video.title,
        poster: video.resolvedPoster || resolve(video.poster, true),
        openUrl: video.shareUrl || video.embedUrl,
      })
    );

    const openLink = document.createElement('a');
    openLink.href = video.shareUrl || video.embedUrl;
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
    const pdfUrl = pdf.resolvedFile || resolve(pdf.filePath, true);
    iframe.src = `${pdfUrl}#page=1&toolbar=0&navpanes=0&scrollbar=0`;
    iframe.loading = 'lazy';
    iframe.title = `${pdf.title} preview`;
    iframe.className = 'media-thumb__pdf';
    iframe.setAttribute('tabindex', '-1');
    iframe.style.pointerEvents = 'none';

    const fallback = document.createElement('div');
    fallback.className = 'resource-fallback hidden';
    fallback.textContent = 'PDF preview unavailable. Use Open to view the file.';

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
