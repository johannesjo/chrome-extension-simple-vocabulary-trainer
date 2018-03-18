import '../img/icon_32x32.png'
import '../img/icon_128x128.png'

const INTERVAL = 60 * 1000;
let interval;

function getRandomKey(obj) {
  const keys = Object.keys(obj)
  return keys[keys.length * Math.random() << 0];
}

function show() {
  let title = 'No vocabulary yet';
  let msg = 'Click on the extension icon to change that.';

  chrome.storage.sync.get(/* String or Array */null, function(items) {
    const randomKey = getRandomKey(items);
    const voc = randomKey;
    const translation = items[randomKey];

    title = voc;
    msg = translation;

    new Notification(title, {
      body: msg,
    });
  });

}

// Test for notification support.
if (window.Notification) {
  interval = setInterval(() => {
    show();
  }, INTERVAL);
  show();
}
