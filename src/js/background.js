import '../img/icon_32x32.png'
import '../img/icon_128x128.png'

const INTERVAL = 60 * 1000;
let interval;

function getRandomKey(obj) {
  const keys = Object.keys(obj);
  return keys[keys.length * Math.random() << 0];
}

const NOTIFICATION_ID = 'NOTIFICATION_ID';

function show() {
  let title = 'No vocabulary yet';
  let msg = 'Click on the extension icon to change that.';

  chrome.storage.sync.get(null, function(items) {
    const randomKey = getRandomKey(items);
    const voc = randomKey;
    const translation = items[randomKey];

    title = voc;
    msg = translation;
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

// Test for notification support.
if (window.Notification) {
  interval = setInterval(() => {
    show();
  }, INTERVAL);
  show();
}
