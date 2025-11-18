executeScript(`
  const root = document.getElementById('__next');
  if (!root) throw new Error('Pixiv Hide Works could not find #__next element');

  const nextData = JSON.parse(document.getElementById('__NEXT_DATA__')?.innerText ?? 'null');
  const preloadedState = JSON.parse(nextData?.props?.pageProps?.serverSerializedPreloadedState ?? 'null');
  const streets = typeof preloadedState?.street === 'object' ? Object.values(preloadedState?.street ?? {}) : [];

  streets.forEach((street) =>
    [street?.data ?? street]?.flat(1)
      ?.flatMap?.((street) =>
        street?.thumbnails?.map?.((thumbnail) => ({
          id: thumbnail?.id,
          tags: thumbnail?.tags?.map?.((tag) => tag?.name)?.filter?.(Boolean),
        }))
      )
      ?.forEach?.((work) => {
        if (work?.id && work?.tags) window.tagsLookup.set(work.id, work.tags);
      })
  );

  const hiddenTags = ['AI作成', 'NovelAI', 'milf', 'ミルフ', 'おっぱい'];
  const highlightedTags = ['女の子'];

  const matchHiddenTag = (workTags) => workTags.find((tag) => hiddenTags.includes(tag))
  const matchHighlightedTag = (workTags) => workTags.find((tag) => highlightedTags.includes(tag))

  const markHidden = (imageWrapper, reason) => {
    imageWrapper.classList.remove('phw-shown');
    imageWrapper.classList.remove('phw-highlighted');
    imageWrapper.classList.remove('phw-unknown');
    imageWrapper.classList.add('phw-hidden');
    imageWrapper.setAttribute('data-phw-hidden-reason', reason);
    };

  const markShown = (imageWrapper) => {
    imageWrapper.classList.remove('phw-hidden');
    imageWrapper.classList.remove('phw-highlighted');
    imageWrapper.classList.remove('phw-unknown');
    imageWrapper.classList.add('phw-shown');
    imageWrapper.removeAttribute('data-phw-hidden-reason');
  };

  const markHighlighted = (imageWrapper) => {
    imageWrapper.classList.remove('phw-hidden');
    imageWrapper.classList.remove('phw-shown');
    imageWrapper.classList.remove('phw-unknown');
    imageWrapper.classList.add('phw-highlighted');
    imageWrapper.removeAttribute('data-phw-hidden-reason');
  };

  const markUnknown = (imageWrapper) => {
    imageWrapper.classList.remove('phw-hidden');
    imageWrapper.classList.remove('phw-shown');
    imageWrapper.classList.remove('phw-highlighted');
    imageWrapper.classList.add('phw-unknown');
    imageWrapper.removeAttribute('data-phw-hidden-reason');
  };

  const update = () => {
    const workLinkElements = root.querySelectorAll('a[href^="/artworks/"]:has(img)');

    workLinkElements.forEach((element) => {
      const workId = element.href.split('/').pop()?.split('#')[0]?.split('?')[0];

      const imageWrapper = element.querySelector('img')?.parentElement;
      if (!imageWrapper) return;

      const workTags = window.tagsLookup.get(workId);
      if (!workTags) {
        markUnknown(imageWrapper);
        return;
      }

      const hiddenTag = matchHiddenTag(workTags);
      if (hiddenTag) {
        markHidden(imageWrapper, hiddenTag);
        return;
      }

      const highlightedTag = matchHighlightedTag(workTags);
      if (highlightedTag) {
        markHighlighted(imageWrapper);
        return;
      }

      markShown(imageWrapper);
    });
  };

  const rootObserver = new MutationObserver(update);
  rootObserver.observe(root, { childList: true, subtree: true });
`);
