class Utils {
  static transformFeedData(feedData) {
    return feedData.items.map(i => {
      return {
        title: i.title,
        contentSnippet: i.contentSnippet.slice(0,200) + '...',
        date: i.isoDate,
        link: i.link
      };
    });
  }
}

module.exports = Utils;
