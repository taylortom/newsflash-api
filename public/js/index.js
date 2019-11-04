const intervalLength = 1000*60*5;
const feedLength = 15;
let originalFetchCache;

$(init);

function init() {
  eventLoop();
  setInterval(eventLoop, intervalLength);

  updateHeaderStyles();
  $(document).on('scroll', onScroll);
}

function updateHeaderStyles() {
  $('.feeds').css('margin-top', $('.title-container').outerHeight(true));
}

function onScroll(e) {
  $('.title-container').toggleClass('minimised', $('html').scrollTop() > 0);
  updateHeaderStyles();
}

function eventLoop() {
  fetchData()
    .then((d) => {
      processData(d);
      render(d);
    })
    .catch((e) => console.error(e));
}

function fetchData() {
  return new Promise((resolve, reject) => {
    $('.timestamp .date').text(formatDate(new Date()));
    $.get('/api/feed').done(resolve).fail(reject);
  });
}

function processData(data) {
  const cache = {};
  data.forEach((f,dI) => {
    f.items.forEach((i,iI) => {
      if(originalFetchCache) {
        if(!originalFetchCache[f.id]) originalFetchCache[f.id] = [];
        data[dI].items[iI].new = !originalFetchCache[f.id].includes(i.title);
      }
      if(!cache[f.id]) cache[f.id] = [];
      cache[f.id].push(i.title);
    });
  });
  if(!originalFetchCache) {
    originalFetchCache = cache;
  }
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
  const title = `<a class="title${data.new ? ' new' : ''}" href="${data.link}" target="_blank">${data.title}</a>`;
  const date = `<div class="date">${formatDate(data.date)}</div>`;
  return `<div class="item">${title}${date}</div>`;
}
function formatDate(date) {
  const now = new Date();
  const dDate = new Date(date);
  if(dDate.getMonth() === now.getMonth() && dDate.getYear() === now.getYear()) {
    if(dDate.getDate() === now.getDate()) {
      return `Today at ${formatTime(dDate)}`;
    }
    if(dDate.getDate() === now.getDate()-1) {
      return `Yesterday at ${formatTime(dDate)}`;
    }
  }
  return `${dDate.toLocaleDateString()} at ${formatTime(dDate)}`;
}

function formatTime(d) {
  return d.toTimeString().slice(0,5);
}
