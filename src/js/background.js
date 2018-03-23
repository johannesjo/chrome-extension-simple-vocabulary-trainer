import '../img/icon_32x32.png'
import '../img/icon_128x128.png'
import { DEFAULT_INTERVAL, SETTINGS_KEY } from './config';

let interval;
let lastIntervalDuration;

function getRandomKey(obj) {
  const keys = Object.keys(obj);
  const randomKey = keys[keys.length * Math.random() << 0];

  if (randomKey === SETTINGS_KEY) {
    return getRandomKey(obj);
  } else {
    return randomKey;
  }
}

const NOTIFICATION_ID = 'NOTIFICATION_ID';

function show() {
  let title = 'No vocabulary yet';
  let msg = 'Click on the extension icon to change that.';

  chrome.storage.sync.get(null, (items) => {
    const randomKey = getRandomKey(items);
    const voc = randomKey;
    const translation = items[randomKey];

    title = voc || 'Broken Vocabulary';
    msg = translation || 'Broken Translation';
    chrome.notifications.create(NOTIFICATION_ID, {
      type: 'list',
      title: title,
      message: '',
      iconUrl: './icon_32x32.png',
      items: [
        { title: title, message: msg },
      ]
    });

    setTimeout(() => {
      chrome.notifications.onClicked.addListener(close);
    }, 10 * 1000);
  });
}

function close() {
  chrome.notifications.clear(NOTIFICATION_ID);
}

function reInitInterval(intervalDuration) {
  if (interval) {
    clearInterval(interval);
  }

  interval = setInterval(() => {
    show();
  }, intervalDuration || DEFAULT_INTERVAL);
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.intervalUpdated) {
    reInitInterval(request.intervalUpdated);
  }
});
show();
reInitInterval();
