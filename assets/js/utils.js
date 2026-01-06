(function () {
  function trimTrailingSlash(value) {
    return value ? value.replace(/\/$/, '') : '';
  }

  function detectBasePath() {
    const baseEl = document.querySelector('base[href]');
    if (baseEl) {
      try {
        const parsed = new URL(baseEl.getAttribute('href'), document.baseURI || window.location.href);
        const [first] = parsed.pathname.split('/').filter(Boolean);
        if (first) return `/${first}`;
      } catch (error) {
        console.warn('base[href] parse issue', error);
      }
    }

    const meta = document.querySelector('meta[name="base-path"]');
    const metaPath = trimTrailingSlash(meta?.content?.trim() || '');

    try {
      const docUrl = new URL(document.baseURI || window.location.href);
      const [first] = docUrl.pathname.split('/').filter(Boolean);
      if (first) return `/${first}`;
    } catch (error) {
      console.warn('document.baseURI parse issue', error);
    }

    if (typeof window !== 'undefined' && window.location?.hostname?.endsWith('github.io')) {
      const segments = window.location.pathname.split('/').filter(Boolean);
      const first = segments[0] || '';
      if (first) return `/${first}`;
    }

    return metaPath || '';
  }

  const basePath = detectBasePath() || '/lip-site';
  const rootPath = trimTrailingSlash(basePath) || '';

  function toSiteUrl(pathOrUrl, { encode } = {}) {
    if (!pathOrUrl) return pathOrUrl;
    if (/^(https?:)?\/\//i.test(pathOrUrl)) return pathOrUrl;

    const base = document.baseURI || window.location.href;

    const needsRoot =
      pathOrUrl.startsWith('/') && !pathOrUrl.startsWith(`${rootPath}/`) && pathOrUrl !== rootPath;
    const normalized = needsRoot ? `${rootPath}${pathOrUrl}` : pathOrUrl;

    try {
      const resolved = new URL(normalized, base).toString();
      return encode ? encodeURI(resolved) : resolved;
    } catch (error) {
      console.warn('toSiteUrl issue', error);
      return encode ? encodeURI(normalized) : normalized;
    }
  }

  function buildUrl(path, { encode } = {}) {
    if (!path) return path;
    return toSiteUrl(path, { encode });
  }

  window.__BASE_PATH__ = rootPath || '/lip-site';
  window.LIP_PATHS = {
    basePath: rootPath,
    buildUrl,
    withBase: buildUrl,
    toSiteUrl,
  };
  window.toSiteUrl = toSiteUrl;
})();
