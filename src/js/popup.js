import "../css/popup.css";
import yml from 'js-yaml';

const area = document.getElementsByTagName('textarea')[0];

chrome.storage.sync.get(/* String or Array */null, function(items) {
  const str = yml.safeDump(items);
  console.log(str);
  area.value = str;
  console.log(items);
});

function updateVocabulary() {
  const val = area.value;
  let doc = false;

  try {
    doc = yml.safeLoad(val, 'utf8');
    console.log(doc);
  } catch (e) {
    console.log(e);
  }

  if (doc) {
    localStorage.vocabulary = doc;
    chrome.storage.sync.set(doc, function() {
      console.log('SAVED');
    });
  }

}

area.addEventListener('input', updateVocabulary);
