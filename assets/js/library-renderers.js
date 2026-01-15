(function () {
  const data = window.LIP_LIBRARY || {};
  const lightbox = window.LIP_LIGHTBOX;
  const pathUtils = window.LIP_PATHS || {};

  const normalizeAssetUrl =
    pathUtils.normalizeAssetUrl || pathUtils.toSiteUrl || pathUtils.buildUrl || pathUtils.withBase || ((v) => v);

  function resolve(path) {
    if (typeof normalizeAssetUrl === 'function') return normalizeAssetUrl(path);
    return path;
  }

  function openInLightbox({ type, src, title, poster, openUrl }) {
    if (lightbox && typeof lightbox.open === 'function') {
      lightbox.open({ type, src, title, poster, openUrl });
    } else if (src) {
      window.open(openUrl || src, '_blank', 'noopener');
    }
  }

  function setPreviewState(wrapper, fallback, state) {
    if (!wrapper) return;
    if (state === 'loaded') {
      wrapper.classList.add('has-preview');
      wrapper.classList.remove('preview-error');
      fallback?.classList.add('hidden');
    } else if (state === 'error') {
      wrapper.classList.add('preview-error');
      wrapper.classList.remove('has-preview');
      fallback?.classList.remove('hidden');
    }
  }

  function buildStyleCard(style) {
    const article = document.createElement('article');
    article.className = 'style-card library-card';

    const media = document.createElement('div');
    media.className = 'style-media preview';

    const mediaButton = document.createElement('button');
    mediaButton.type = 'button';
    mediaButton.className = 'style-preview-link';
    mediaButton.setAttribute('aria-label', `Open ${style.title} preview`);

    const img = document.createElement('img');
    img.src = style.resolvedImage || resolve(style.imagePath);
    img.alt = style.title;
    img.loading = 'lazy';
    img.className = 'style-preview';

    const fallback = document.createElement('div');
    fallback.className = 'style-fallback preview-overlay hidden';
    fallback.textContent = style.badge || style.title;

    img.addEventListener('load', () => {
      media.classList.add('has-preview');
      img.classList.remove('hidden');
      fallback.classList.add('hidden');
    });

    img.addEventListener('error', () => {
      media.classList.remove('has-preview');
      img.classList.add('hidden');
      fallback.classList.remove('hidden');
    });

    mediaButton.addEventListener('click', () =>
      openInLightbox({ type: 'image', src: style.resolvedImage || resolve(style.imagePath), title: style.title })
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
      openInLightbox({ type: 'image', src: style.resolvedImage || resolve(style.imagePath), title: style.title })
    );

    const openLink = document.createElement('a');
    openLink.href = style.resolvedImage || resolve(style.imagePath);
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
        try {
          const card = buildStyleCard(style);
          if (card) grid.appendChild(card);
        } catch (error) {
          console.warn('Style render issue', error);
        }
      });
    });
  }

  function buildVideoCard(video) {
    const article = document.createElement('article');
    article.className = 'resource-card media-card';

    const previewWrap = buildEmbedShell({
      kind: 'Video',
      src: resolve(video.embedUrl || video.shareUrl),
      openUrl: resolve(video.shareUrl || video.embedUrl),
    });

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
        src: resolve(video.embedUrl || video.shareUrl),
        title: video.title,
        poster: video.resolvedPoster || resolve(video.poster),
        openUrl: resolve(video.shareUrl || video.embedUrl),
      })
    );

    const openLink = document.createElement('a');
    openLink.href = resolve(video.shareUrl || video.embedUrl);
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

    const pdfUrl = pdf.resolvedFile || resolve(pdf.filePath);
    const previewWrap = buildEmbedShell({
      kind: 'PDF',
      src: `${pdfUrl}#page=1&toolbar=0&navpanes=0&scrollbar=0`,
      openUrl: pdfUrl,
      downloadUrl: pdfUrl,
    });

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
      openInLightbox({ type: 'pdf', src: pdf.resolvedFile || resolve(pdf.filePath), title: pdf.title })
    );

    const openLink = document.createElement('a');
    openLink.href = pdf.resolvedFile || resolve(pdf.filePath);
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

  function buildEmbedShell({ kind, src, openUrl, downloadUrl }) {
    const shell = document.createElement('div');
    shell.className = 'embed-shell';
    shell.dataset.kind = kind;
    shell.dataset.src = src;
    shell.dataset.open = openUrl || src;
    if (downloadUrl) {
      shell.dataset.download = downloadUrl;
    }

    const placeholder = document.createElement('div');
    placeholder.className = 'embed-placeholder';

    const badge = document.createElement('div');
    badge.className = 'embed-badge';
    badge.textContent = `${kind} preview`;

    const loadButton = document.createElement('button');
    loadButton.type = 'button';
    loadButton.className = 'embed-load btn-secondary btn-sm';
    loadButton.textContent = 'Load preview';

    const openLink = document.createElement('a');
    openLink.className = 'embed-open btn-secondary btn-sm';
    openLink.href = openUrl || src;
    openLink.target = '_blank';
    openLink.rel = 'noopener';
    openLink.textContent = 'Open in new tab';

    placeholder.append(badge, loadButton, openLink);

    if (downloadUrl) {
      const downloadLink = document.createElement('a');
      downloadLink.className = 'embed-download btn-secondary btn-sm';
      downloadLink.href = downloadUrl;
      downloadLink.setAttribute('download', '');
      downloadLink.textContent = 'Download';
      placeholder.appendChild(downloadLink);
    }

    const fallback = document.createElement('div');
    fallback.className = 'embed-fallback';
    fallback.textContent = 'Preview unavailable here. Open in new tab.';

    shell.append(placeholder, fallback);
    return shell;
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderStyles();
    renderVideos();
    renderPdfs();
  });
})();
