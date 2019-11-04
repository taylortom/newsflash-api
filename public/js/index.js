const intervalLength = 1000*60*5;
const feedLength = 15;

$(init);

function init() {
  updateHeaderStyles();
  $(document).on('scroll', onScroll);
  eventLoop();
  setInterval(eventLoop, intervalLength);
}

function updateHeaderStyles() {
  $('.feeds').css('margin-top', $('.title-container').outerHeight());
}

function onScroll(e) {
  if($('html').scrollTop() > 50) {
    $('.title-container').addClass('minimised');
  } else {
    $('.title-container').removeClass('minimised');
  }
}

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
