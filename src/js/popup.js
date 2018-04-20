import "../css/popup.css";
import yml from 'js-yaml';
import { DEFAULT_INTERVAL, SETTINGS_KEY } from './config';
import { FAVORITES_KEY } from './config';

const area = document.getElementsByTagName('textarea')[0];
const timeInput = document.getElementById('interval');
const errorEl = document.getElementById('error');

chrome.storage.sync.get(/* String or Array */null, function(items) {
  const vocab = Object.assign({}, items);
  delete vocab[SETTINGS_KEY];
  delete vocab[FAVORITES_KEY];
  area.value = yml.safeDump(vocab);
  timeInput.value = (items[SETTINGS_KEY].intervalDuration || DEFAULT_INTERVAL) / 1000;
});

function updateVocabulary() {
  const val = area.value;
  let doc = false;

  errorEl.innerHTML = '';
  try {
    doc = yml.safeLoad(val, 'utf8');
  } catch (e) {
    console.log(e);
    errorEl.innerHTML = e.message;
  }

  if (doc) {
    doc[SETTINGS_KEY] = {
      intervalDuration: getInterValDurationParsedForStorage(),
    };

    // update doc and notify about storage being updated
    chrome.storage.sync.set(doc, () => {
      chrome.runtime.sendMessage({ intervalUpdated: getInterValDurationParsedForStorage() });
    });
  }
}

function getInterValDurationParsedForStorage() {
  if (!timeInput.value) {
    return DEFAULT_INTERVAL;
  }
  return parseInt(timeInput.value) * 1000 || DEFAULT_INTERVAL
}

function updateInterval() {
  if (!timeInput.value) {
    return;
  }

  const newVal = parseInt(timeInput.value, 10);

  if (newVal < 10) {
    errorEl.innerHTML = 'Has to be at least 10';
    return;
  } else {
    errorEl.innerHTML = '';
  }

  const obj = {};

  obj[SETTINGS_KEY] = {
    intervalDuration: getInterValDurationParsedForStorage()
  };
  chrome.storage.sync.set(obj, function() {
    chrome.runtime.sendMessage({ intervalUpdated: getInterValDurationParsedForStorage() });
  });
}

area.addEventListener('input', updateVocabulary);
timeInput.addEventListener('input', updateInterval);
