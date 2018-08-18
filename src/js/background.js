import '../img/icon_32x32.png'
import '../img/icon_128x128.png'
import { DEFAULT_INTERVAL, LOCKED_KEYS, SETTINGS_KEY } from './config';
import { FAVORITES_KEY } from './config';

const log = console.log;

let showInterval;
let lastIntervalDuration;
let lastNotification;

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

    let voc;
    let translation;

    // every one of three should be a favorite if there are any
    const favorites = items[FAVORITES_KEY];
    const isShowFavorite = (Math.floor((Math.random() * 3) + 1) === 1 && favorites && Object.keys(favorites).length > 0);
    if (isShowFavorite) {
      const randomKey = getRandomKey(favorites);
      voc = randomKey;
      translation = favorites[randomKey];
    } else {
      const randomKey = getRandomKey(items);
      voc = randomKey;
      translation = items[randomKey];
    }

    lastNotification = {};
    lastNotification[voc] = translation;

    title = voc || 'Broken Vocabulary';
    msg = translation || 'Broken Translation';
    chrome.notifications.create(NOTIFICATION_ID, {
      type: 'list',
      title: (isShowFavorite ? '❤ ' : '') + title,
      message: '',
      iconUrl: './icon_32x32.png',
      items: [
        { title: title, message: msg },
      ],
      buttons: [{
        title: `${isShowFavorite ? 'Remove from' : 'Add to'} favorites`,
      }, {
        title: 'Mute for 1 hour',
      }]
    });

    // auto close after 10 seconds, which is our min interval
    setTimeout(() => {
      close(NOTIFICATION_ID);
    }, 10 * 1000);
  });
}

chrome.notifications.onClicked.addListener(close);
chrome.notifications.onButtonClicked.addListener((notificationId, btnIdx) => {

  if (notificationId === NOTIFICATION_ID) {
    if (btnIdx === 0) {
      chrome.storage.sync.get(FAVORITES_KEY, (favoritesWrapperObj) => {
        if (favoritesWrapperObj) {
          const vocabs = favoritesWrapperObj[FAVORITES_KEY];
          const newVocabKey = Object.keys(lastNotification)[0];
          if (vocabs[newVocabKey]) {
            // delete
            delete vocabs[newVocabKey];
            log('Delete:', newVocabKey);
          } else {
            // add
            favoritesWrapperObj[FAVORITES_KEY] = Object.assign(lastNotification, favoritesWrapperObj[FAVORITES_KEY]);
            log('Add:', newVocabKey);
          }

        } else {
          const obj = {};
          obj[FAVORITES_KEY] = lastNotification;
          favoritesWrapperObj = obj;
        }
        chrome.storage.sync.set(favoritesWrapperObj);
      });
    } else if (btnIdx === 1) {
      const oneHour = 60 * 60 * 1000;
      log(`Muting for ${oneHour} milliseconds`);
      reInitInterval(oneHour);
    }

    close(NOTIFICATION_ID);
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
