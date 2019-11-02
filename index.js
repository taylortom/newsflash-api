const App = require('./lib/app');
const dotenv = require('dotenv');

dotenv.config();
new App().start();
