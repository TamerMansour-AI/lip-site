(function () {
  function trimTrailingSlash(value) {
    return value ? value.replace(/\/$/, '') : '';
  }

  function detectBasePath() {
    const meta = document.querySelector('meta[name="base-path"]');
    const metaPath = trimTrailingSlash(meta?.content?.trim() || '');
    if (metaPath) return metaPath;

    if (typeof window !== 'undefined') {
      const winBase = trimTrailingSlash(window.__BASE_PATH__ || '');
      if (winBase) return winBase;

      if (window.location?.hostname?.endsWith('github.io')) {
        const segments = window.location.pathname.split('/').filter(Boolean);
        const first = segments[0] || '';
        if (first) return `/${first}`;
      }
    }

    return '';
  }

  const basePath = detectBasePath() || '/lip-site';
  window.__BASE_PATH__ = basePath;

  function withBase(path, { encode } = {}) {
    if (!path) return path;
    if (/^(https?:)?\/\//i.test(path)) return path;
    const cleanBase = basePath === '/' ? '' : basePath;
    if (path.startsWith(cleanBase + '/')) {
      return encode ? encodeURI(path) : path;
    }
    const prefixed = path.startsWith('/') ? `${cleanBase}${path}` : path;
    return encode ? encodeURI(prefixed) : prefixed;
  }

  const STYLE_ITEMS = [
    {
      id: 'style-01',
      title: 'Style 01 – Clay toy',
      description: 'Clay toy charm with tactile textures. Perfect for playful science explainers.',
      imagePath: '/assets/styles/Clay toy.png',
    },
    {
      id: 'style-02',
      title: 'Style 02 – Flat vector',
      description: 'Crisp flat vectors that keep concepts clear. Great for step-by-step visuals.',
      imagePath: '/assets/styles/Flat Vetor.png',
    },
    {
      id: 'style-03',
      title: 'Style 03 – Soft pastel',
      description: 'Soft pastel warmth with gentle gradients. Ideal for calming classroom stories.',
      imagePath: '/assets/styles/Soft Pastel.png',
    },
    {
      id: 'style-04',
      title: 'Style 04 – Anime tech',
      description: 'Anime-tech energy with sleek glows. Great for future-forward STEM stories.',
      imagePath: '/assets/styles/Anime tech.png',
    },
    {
      id: 'style-05',
      title: 'Style 05 – Paper cut',
      description: 'Layered paper-cut depth for tactile storytelling. Feels crafted and tangible.',
      imagePath: '/assets/styles/Paper Cut.png',
    },
    {
      id: 'style-06',
      title: 'Style 06 – Cozy 3D doll',
      description: 'Cozy 3D dolls with soft lighting. Invites young learners into the scene.',
      imagePath: '/assets/styles/Cozy 3D Doll.png',
    },
    {
      id: 'style-07',
      title: 'Style 07 – Watercolor',
      description: 'Loose watercolor washes with airy ink lines. Great for empathetic storytelling.',
      imagePath: '/assets/styles/Watercolor.png',
    },
    {
      id: 'style-08',
      title: 'Style 08 – Retro poster',
      description: 'Retro poster punch with bold type. Perfect for announcements and hooks.',
      imagePath: '/assets/styles/Retro Poster.png',
    },
    {
      id: 'style-09',
      title: 'Style 09 – Neon cinematic',
      description: 'Neon cinematic glow with dramatic contrast. Great for tech-forward reveals.',
      imagePath: '/assets/styles/Neon Cinematic.png',
    },
    {
      id: 'style-10',
      title: 'Style 10 – Photoreal',
      description: 'Photoreal clarity that mirrors live classrooms. Ideal for credibility and detail.',
      imagePath: '/assets/styles/Photoreal.png',
    },
  ];

  const VIDEO_ITEMS = [
    {
      id: 'video-01',
      title: 'Animated Explainers (Pilot) – Overview',
      description: 'Local MP4 preview of the animated explainers walkthrough.',
      filePath: '/assets/videos/animated-explainers-overview.mp4',
      poster: '/assets/styles/style-01.jpg',
    },
    {
      id: 'video-02',
      title: 'Source-Bound Lesson Clarity – Sample clip',
      description: 'Local MP4 preview for the “Source-Bound Lesson Clarity” concept.',
      filePath: '/assets/videos/source-bound-lesson-clarity.mp4',
      poster: '/assets/styles/style-04.jpg',
    },
  ];

  const PDF_ITEMS = [
    {
      id: 'pdf-01',
      title: 'Science Concept Animation Pilot',
      description: 'Example pilot deck for a science concept animation.',
      filePath: '/assets/docs/Science_Concept_Animation_Pilot.pdf',
    },
    {
      id: 'pdf-02',
      title: 'Curriculum Amplified — Teacher Time Saved',
      description: 'Slide deck for the “Curriculum Amplified / Teacher Time Saved” concept.',
      filePath: '/assets/docs/Curriculum_Amplified_Teacher_Time_Saved.pdf',
    },
    {
      id: 'pdf-03',
      title: 'Source-Bound Lesson Clarity',
      description: 'Slide deck explaining the “Source-Bound Lesson Clarity” concept.',
      filePath: '/assets/docs/Source_Bound_Lesson_Clarity.pdf',
    },
    {
      id: 'pdf-04',
      title: 'LIP Pilot Snapshot',
      description: 'At-a-glance PDF for the Lesson Intelligence Packs pilot.',
      filePath: '/assets/docs/LIP_Pilot_Snapshot.pdf',
    },
    {
      id: 'pdf-05',
      title: 'Animated Explainers Pilot – What This Includes',
      description: 'Breakdown of the animated explainers pilot deliverables.',
      filePath: '/assets/docs/Animated_Explainers_Pilot_What_This_Includes.pdf',
    },
    {
      id: 'pdf-06',
      title: 'LIP Sample Frames Guide',
      description: 'Reference frames and guidance for LIP visuals.',
      filePath: '/assets/docs/LIP_Sample_Frames_Guide.pdf',
    },
    {
      id: 'pdf-07',
      title: 'LIP Style Menu',
      description: 'Menu of visual style directions for Lesson Intelligence Packs.',
      filePath: '/assets/docs/LIP_Style_Menu.pdf',
    },
    {
      id: 'pdf-08',
      title: 'LIP Short FAQ',
      description: 'Quick answers to common questions about LIP.',
      filePath: '/assets/docs/LIP_Short_FAQ.pdf',
    },
  ];

  const styles = STYLE_ITEMS.map((item, index) => ({
    ...item,
    badge: item.badge || `Style ${String(index + 1).padStart(2, '0')}`,
    resolvedImage: withBase(item.imagePath, { encode: true }),
  }));

  const videos = VIDEO_ITEMS.map((item, index) => ({
    ...item,
    badge: item.badge || `Video ${String(index + 1).padStart(2, '0')}`,
    resolvedFile: withBase(item.filePath, { encode: true }),
    resolvedPoster: item.poster ? withBase(item.poster, { encode: true }) : '',
  }));

  const pdfs = PDF_ITEMS.map((item, index) => ({
    ...item,
    badge: item.badge || `PDF ${String(index + 1).padStart(2, '0')}`,
    resolvedFile: withBase(item.filePath, { encode: true }),
  }));

  window.LIP_LIBRARY = {
    basePath,
    withBase,
    styles,
    videos,
    pdfs,
  };
})();
