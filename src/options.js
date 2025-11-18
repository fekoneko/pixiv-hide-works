const form = document.getElementById('form');
const hiddenTagsInput = document.getElementById('hidden-tags');
const highlightedTagsInput = document.getElementById('highlighted-tags');
const submitButton = document.getElementById('submit');

const loadDefaultOptions = async () => {
  hiddenTagsInput.value = 'Loading...';
  highlightedTagsInput.value = 'Loading...';
  hiddenTagsInput.setAttribute('disabled', 'disabled');
  highlightedTagsInput.setAttribute('disabled', 'disabled');
  submitButton.setAttribute('disabled', 'disabled');

  let { options } = await browser.storage.sync.get('options');
  options = {
    hiddenTags: options?.hiddenTags ?? [],
    highlightedTags: options?.highlightedTags ?? [],
  };

  hiddenTagsInput.value = options.hiddenTags.join(', ');
  highlightedTagsInput.value = options.highlightedTags.join(', ');
  hiddenTagsInput.removeAttribute('disabled');
  highlightedTagsInput.removeAttribute('disabled');
  submitButton.removeAttribute('disabled');
};

loadDefaultOptions();

const parseToArray = (value) =>
  value
    ?.split(/[\n,、 　]/g)
    .filter(Boolean)
    .map((tag) => tag.trim()) ?? [];

const handleSubmit = (event) => {
  event.preventDefault();

  const options = {
    hiddenTags: parseToArray(hiddenTagsInput.value),
    highlightedTags: parseToArray(highlightedTagsInput.value),
  };
  browser.storage.sync.set({ options });

  hiddenTagsInput.value = options.hiddenTags.join(', ');
  highlightedTagsInput.value = options.highlightedTags.join(', ');
};

form.addEventListener('submit', handleSubmit);
