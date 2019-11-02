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
    Promise.all(this.feeds.map(f => this.fetchFeed(Object.assign(f,opts))))
      .then(d => {
        console.log(d);
        resolve(d);
      })
      .catch(reject);
  }
  fetchFeed(opts) {
    /** @todo check input */
    return new Promise(async (resolve, reject) => {
      new RssParser().parseURL(opts.url)
        .then(d => resolve(Utils.transformFeedData(d)))
        .catch(e => reject(new Error(`Failed to fetch feed ${opts.id}, ${e}`)));
    });
  }
}

module.exports = Feeds;
