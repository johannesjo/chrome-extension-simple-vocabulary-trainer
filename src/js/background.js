import '../img/icon_32x32.png'
import '../img/icon_128x128.png'

//const opt = {
//  type: "list",
//  title: "Primary Title",
//  message: "Primary message to display",
//  iconUrl: "url_to_small_icon",
//  items: [{ title: "Item1", message: "This is item 1."},
//    { title: "Item2", message: "This is item 2."},
//    { title: "Item3", message: "This is item 3."}]
//};

const opt = {
  type: 'basic',
  title: 'Primary Title',
  message: 'Primary message to display',
  iconUrl: 'url_to_small_icon'
};
chrome.notifications.create(id, opt, ()=>{
  console.log('shown');
});