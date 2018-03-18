import '../img/icon_32x32.png'
import '../img/icon_128x128.png'

const INTERVAL = 60 * 1000;
let interval;

function show() {
  const title = 'TEST';
  const msg = 'Time to make the toast.';

  new Notification(title, {
    body: msg,
  });
}

// Test for notification support.
if (window.Notification) {
  interval = setInterval(() => {
    show();
  }, INTERVAL);
  show();
}
