const root = document.getElementById('__next');
if (!root) throw new Error('Pixiv Hide Works could not find #__next element');

const hide = (imageWrapper, reason) => {
  imageWrapper?.classList.add('phw-hidden');
  imageWrapper?.setAttribute('data-phw-hidden-reason', reason);
};

const update = () => {
  const workLinkElements = root.querySelectorAll('a[href^="/artworks/"]:has(img)');
  workLinkElements.forEach((element) => {
    const workId = element.href.split('/').pop()?.split('#')[0]?.split('?')[0];
    const imageWrapper = element.querySelector('img')?.parentElement;
    hide(imageWrapper, workId);
  });
};

const rootObserver = new MutationObserver(update);
rootObserver.observe(root, { childList: true, subtree: true });
