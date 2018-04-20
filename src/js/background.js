import '../img/icon_32x32.png'
import '../img/icon_128x128.png'
import { DEFAULT_INTERVAL, LOCKED_KEYS, SETTINGS_KEY } from './config';

let showInterval;
let lastIntervalDuration;

function getRandomKey(obj) {
  const keys = Object.keys(obj);
  const randomKey = keys[keys.length * Math.random() << 0];

  if (LOCKED_KEYS.indexOf(randomKey) > -1) {
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
    const settings = items[SETTINGS_KEY];

    if (settings && settings.intervalDuration !== lastIntervalDuration) {
      reInitInterval(settings.intervalDuration);
    }

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
      ],
      buttons: [{
        title: 'Add to favorites',
      }, {
        title: 'Mute for 1 hour',
      }]
    });

    // auto close after 10 seconds, which is our min interval
    setTimeout(() => {
      close();
    }, 10 * 1000);
  });
}

chrome.notifications.onClicked.addListener(close);
chrome.notifications.onButtonClicked.addListener((notificationId, btnIdx) => {

  if (notificationId === NOTIFICATION_ID) {
    if (btnIdx === 0) {

    } else if (btnIdx === 1) {
      const oneHour = 60 * 60 * 1000;
      console.log(`Muting for ${oneHour} milliseconds`);
      reInitInterval(oneHour);
    }
  }
});

function close(notificationId) {
  if (notificationId === NOTIFICATION_ID) {
    chrome.notifications.clear(NOTIFICATION_ID);
  }
}

function reInitInterval(intervalDuration) {
  if (showInterval) {
    clearInterval(showInterval);
  }

  showInterval = setInterval(() => {
    show();
  }, intervalDuration || DEFAULT_INTERVAL);
  lastIntervalDuration = intervalDuration;
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.intervalUpdated) {
    reInitInterval(request.intervalUpdated);
  }
});
show();
reInitInterval();
