module.exports = (client) => {
  client.wait = require('util').promisify(setTimeout);
};