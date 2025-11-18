const executeScript = (code) => {
  const script = document.createElement('script');
  script.textContent = code;
  document.documentElement.appendChild(script);
  script.remove();
};

executeScript(`
  const urlsOfResponsesWithTags = [
    /https?:\\/\\/www.pixiv.net\\/ajax\\/illust\\/discovery.*/,
    /https?:\\/\\/www.pixiv.net\\/ajax\\/user\\/[1-9]*\\/illusts\\/bookmarks.*/,
    /https?:\\/\\/www.pixiv.net\\/ajax\\/user\\/[1-9]*\\/profile\\/top*/,
    /https?:\\/\\/www.pixiv.net\\/ajax\\/user\\/[1-9]*\\/works\\/latest*/,
    /https?:\\/\\/www.pixiv.net\\/ajax\\/street\\/v2\\/main*/,
    /https?:\\/\\/www.pixiv.net\\/ajax\\/street\\/for_you*/,
    /https?:\\/\\/www.pixiv.net\\/ajax\\/street\\/latest*/,
    /https?:\\/\\/www.pixiv.net\\/ajax\\/follow_latest\\/illust*/,
    /https?:\\/\\/www.pixiv.net\\/ajax\\/top\\/manga*/,
    /https?:\\/\\/www.pixiv.net\\/ajax\\/top\\/illust*/,
  ];
  window.tagsLookup = new Map();
  const originalFetch = window.fetch;

  const inspectResponse = async (response) => {
    const json = await response.json();

    let works =
      json?.body?.works ??
      json?.body?.illusts ??
      json?.body?.thumbnails?.illust ??
      (json?.body?.contents ?? [json?.body?.content])?.flat(1)?.flatMap?.((content) =>
        content?.thumbnails?.map?.((thumbnail) => ({
          id: thumbnail?.id,
          tags: thumbnail?.tags?.map?.((tag) => tag?.name)?.filter?.(Boolean),
        }))
      );
    if (typeof works === 'object' && !Array.isArray(works)) {
      works = Object.values(works);
    }

    works?.forEach((work) => {
      if (!work?.id || !work?.tags) return;
      window.tagsLookup.set(work.id, work.tags);
    });
  };

  window.fetch = async (...args) => {
    const response = await originalFetch(...args);

    if (response.ok && urlsOfResponsesWithTags.some((url) => url.test(response.url))) {
      inspectResponse(response.clone());
    }
    return response;
  };
`);
