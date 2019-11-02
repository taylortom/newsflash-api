const express = require('express');
const Feeds = require('./feeds');

class ApiServer {
  constructor() {
    this.express = express();
    this.initMiddleware();
    this.initRoutes();
  }
  initMiddleware() {
    this.express.use([
      (req, res, next) => {
        if(req.hostname !== process.env.SERVER_HOST) {
          return res.status(401).json({ error: "Not authorised to access this endpoint" });
        }
        next();
      }
    ]);
  }
  initRoutes() {
    const feeds = new Feeds();
    this.express.get('/api/feed', (req, res, next) => {
      feeds.fetchAll()
        .then(d => {
          console.log(d.length);
          res.json(d);
        })
        .catch(e => res.status(500).json({ error: e.message }));
    });
    this.express.get('/api/feeds', (req, res, next) => {
      res.json(feeds.feeds);
    });
  }
  start() {
    const port = process.env.SERVER_PORT;
    this.express.listen(port, () => console.log(`Server listening on ${port}`));
  }
}

module.exports = ApiServer;
