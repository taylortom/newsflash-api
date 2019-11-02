const express = require('express');
const Feeds = require('./feeds');

class App {
  constructor() {
    this.express = express();
    this.feeds = new Feeds();

    this.initExpress();
    this.initRoutes();
  }
  initExpress() {
    this.express.set('view engine', 'hbs');
    this.express.set('views', `${process.cwd()}/templates`);
    this.express.set('x-powered-by', false);
    this.express.use(express.static('./public'));
  }
  initRoutes() {
    this.express.get('/', this.renderIndex);
    this.express.get('/api/feed', this.restrictApiMiddleware, this.sendFeed.bind(this));
    this.express.use((e, req, res, next) => res.status(500).json({ error: e.message }));
    return this;
  }
  start() {
    const port = process.env.SERVER_PORT;
    this.express.listen(port, () => console.log(`Listening on ${port}`));
  }
  restrictApiMiddleware(req, res, next) {
    if(req.hostname !== process.env.SERVER_HOST) {
      return res.status(401).json({ error: "Not authorised to access this endpoint" });
    }
    next();
  }
  renderIndex(req, res) {
    res.render('index');
  }
  sendFeed(req, res, next) {
    this.feeds.fetchAll().then(d => res.json(d)).catch(next);
  }
}


module.exports = App;
