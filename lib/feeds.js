const feedsJson = require('../feeds.json');
const RssParser = require('rss-parser');
const Utils = require('./utils');

class Feeds {
  constructor() {
    const feedsById = feedsJson.reduce((m,f) => {
      m[f.id] = f;
      return m;
    }, {});
    this.feeds = process.env.FEEDS.split(',').map(f => feedsById[f]);
  }
  fetchAll(opts) {
    const promises = this.feeds.map(f => {
      return new Promise((resolve, reject) => {
        this.fetchFeed(Object.assign(f,opts))
          .then(d => resolve({ ...f, items: d }))
          .catch(reject);
      });
    });
    return Promise.all(promises);
  }
  fetchFeed(opts) {
    /** @todo check input opts */
    return new Promise(async (resolve, reject) => {
      new RssParser().parseURL(opts.url)
        .then(d => resolve(Utils.transformFeedData(d)))
        .catch(e => {
          console.log(`Failed to fetch feed ${opts.id}, ${e} ${new Date().toString().slice(0,24)}`);
          resolve([]);
        });
    });
  }
}

module.exports = Feeds;
