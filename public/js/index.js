const intervalLength = 1000*60*5;
const feedLength = 15;

$(() => {
  eventLoop();
  // setInterval(eventLoop, intervalLength);
});

function eventLoop() {
  fetchData()
    .then((d) => render(d))
    .catch((e) => console.error(e.responseText));
}

function fetchData() {
  return new Promise((resolve, reject) => {
    $('.timestamp .date').text(formatDate(new Date()));
    $.get('/api/feed').done(resolve).fail(reject);
  });
}

function render(data) {
  $('.feeds').html(data.map(d => feedHTML(d)).join(''));
}

function feedHTML(data) {
  return `<div class="feed"><a class="title" href="${data.link}" target="_blank">${data.title}</a>${feedItemsHTML(data.items)}</div>`;
}

function feedItemsHTML(data) {
  const items = data.slice(0, feedLength);
  return `<div class="items">${items.map(i => feedItemHTML(i)).join('')}</div>`;
}

function feedItemHTML(data) {
  const title = `<a class="title" href="${data.link}" target="_blank">${data.title}</a>`;
  const date = `<div class="date">${formatDate(data.date)}</div>`;
  return `<div class="item">${title}${date}</div>`;
}
// TODO handle other days
function formatDate(date) {
  const now = new Date();
  const dDate = new Date(date);
  if(dDate.getMonth() === now.getMonth() && dDate.getYear() === now.getYear()) {
    if(dDate.getDate() === now.getDate()) {
      return `Today at ${dDate.toTimeString().slice(0,5)}`;
    }
    if(dDate.getDate() === now.getDate()-1) {
      return `Yesterday at ${dDate.toTimeString().slice(0,5)}`;
    }
  }
  return dDate.toString();
}
