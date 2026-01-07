(function () {
  const pathUtils = window.LIP_PATHS || {};
  const toSiteUrl = pathUtils.toSiteUrl || ((path) => path);
  const withBase = pathUtils.buildUrl || pathUtils.withBase || ((path) => path);
  const normalizeAssetUrl = pathUtils.normalizeAssetUrl || ((path) => path);
  const basePath = pathUtils.basePath || '/lip-site';

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
      description: 'Drive-hosted preview of the animated explainers walkthrough.',
      driveFileId: '1AAT0PYvaKpkr4Bntf9jOa-PI0eQXXw-8',
      shareUrl: 'https://drive.google.com/file/d/1AAT0PYvaKpkr4Bntf9jOa-PI0eQXXw-8/view?usp=sharing',
      embedUrl: 'https://drive.google.com/file/d/1AAT0PYvaKpkr4Bntf9jOa-PI0eQXXw-8/preview',
      poster: '/assets/styles/style-01.jpg',
    },
    {
      id: 'video-02',
      title: 'Source-Bound Lesson Clarity – Sample clip',
      description: 'Drive-hosted overview video for the “Source-Bound Lesson Clarity” concept.',
      driveFileId: '1Fm7M7XXIYTBW-UBI9UgXyy4ZhEyZhCJa',
      shareUrl: 'https://drive.google.com/file/d/1Fm7M7XXIYTBW-UBI9UgXyy4ZhEyZhCJa/view?usp=sharing',
      embedUrl: 'https://drive.google.com/file/d/1Fm7M7XXIYTBW-UBI9UgXyy4ZhEyZhCJa/preview',
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
  ];

  const styles = STYLE_ITEMS.map((item, index) => ({
    ...item,
    badge: item.badge || `Style ${String(index + 1).padStart(2, '0')}`,
    resolvedImage: normalizeAssetUrl(item.imagePath),
  }));

  const videos = VIDEO_ITEMS.map((item, index) => {
    const embedUrl = item.embedUrl || (item.driveFileId ? `https://drive.google.com/file/d/${item.driveFileId}/preview` : '');
    return {
      ...item,
      badge: item.badge || `Video ${String(index + 1).padStart(2, '0')}`,
      embedUrl,
      shareUrl: item.shareUrl || embedUrl,
      resolvedPoster: item.poster ? normalizeAssetUrl(item.poster) : '',
    };
  });

  const pdfs = PDF_ITEMS.map((item, index) => ({
    ...item,
    badge: item.badge || `PDF ${String(index + 1).padStart(2, '0')}`,
    resolvedFile: normalizeAssetUrl(item.filePath),
  }));

  window.LIP_LIBRARY = {
    basePath,
    withBase,
    styles,
    videos,
    pdfs,
  };
})();
