const ApiServer = require('./lib/apiServer');
const dotenv = require('dotenv');

dotenv.config();
new ApiServer().start();
