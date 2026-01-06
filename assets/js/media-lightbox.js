(function () {
  const state = {
    lightbox: null,
    body: null,
    title: null,
    openLink: null,
  };

  function buildLightbox() {
    if (state.lightbox) return state.lightbox;
    const wrapper = document.createElement('div');
    wrapper.id = 'media-lightbox';
    wrapper.className = 'media-lightbox';
    wrapper.setAttribute('aria-hidden', 'true');
    wrapper.setAttribute('role', 'dialog');
    wrapper.setAttribute('aria-modal', 'true');

    const overlay = document.createElement('div');
    overlay.className = 'media-lightbox__overlay';
    overlay.setAttribute('data-media-lightbox-overlay', '');

    const dialog = document.createElement('div');
    dialog.className = 'media-lightbox__dialog';

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'media-lightbox__close';
    closeBtn.setAttribute('aria-label', 'Close preview');
    closeBtn.innerHTML = '&times;';

    const content = document.createElement('div');
    content.className = 'media-lightbox__body';
    content.setAttribute('data-media-lightbox-body', '');

    const meta = document.createElement('div');
    meta.className = 'media-lightbox__meta';

    const title = document.createElement('div');
    title.className = 'media-lightbox__title';
    title.setAttribute('data-media-lightbox-title', '');

    const openLink = document.createElement('a');
    openLink.className = 'media-lightbox__open';
    openLink.setAttribute('data-media-lightbox-open', '');
    openLink.textContent = 'Open in new tab';
    openLink.target = '_blank';
    openLink.rel = 'noopener';
    openLink.classList.add('hidden');
    openLink.addEventListener('click', (event) => event.stopPropagation());

    meta.append(title, openLink);

    dialog.append(closeBtn, content, meta);
    wrapper.append(overlay, dialog);
    document.body.appendChild(wrapper);

    state.lightbox = wrapper;
    state.body = content;
    state.title = title;
    state.openLink = openLink;

    overlay.addEventListener('click', close);
    dialog.addEventListener('click', (event) => event.stopPropagation());
    closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && wrapper.classList.contains('active')) {
        close();
      }
    });

    return wrapper;
  }

  function close() {
    if (!state.lightbox) return;
    state.lightbox.classList.remove('active');
    state.lightbox.setAttribute('aria-hidden', 'true');
    state.title.textContent = '';
    if (state.openLink) {
      state.openLink.removeAttribute('href');
      state.openLink.classList.add('hidden');
    }
    if (state.body) {
      state.body.innerHTML = '';
    }
    document.body.classList.remove('modal-open');
  }

  function createMediaEl({ type, src, poster }) {
    if (!src) return null;
    if (type === 'image') {
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      img.loading = 'lazy';
      img.className = 'media-lightbox__img';
      return img;
    }

    if (type === 'video') {
      const video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.preload = 'metadata';
      video.playsInline = true;
      video.className = 'media-lightbox__video';
      if (poster) video.poster = poster;
      return video;
    }

    const frame = document.createElement('iframe');
    frame.src = src;
    frame.loading = 'lazy';
    frame.title = 'Document preview';
    frame.className = 'media-lightbox__frame';
    frame.setAttribute('allowfullscreen', 'true');
    return frame;
  }

  function open({ type, src, title, poster }) {
    if (!src) return;
    const lb = buildLightbox();
    if (!lb || !state.body) return;

    const contentEl = createMediaEl({ type, src, poster });
    if (!contentEl) return;

    state.body.innerHTML = '';
    state.body.appendChild(contentEl);
    state.title.textContent = title || '';
    if (state.openLink) {
      state.openLink.href = src;
      state.openLink.classList.remove('hidden');
    }

    lb.classList.add('active');
    lb.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function initWhenReady() {
    if (document.body) {
      buildLightbox();
      return;
    }
    document.addEventListener('DOMContentLoaded', buildLightbox, { once: true });
  }

  initWhenReady();

  window.LIP_LIGHTBOX = {
    open,
    close,
  };
})();
