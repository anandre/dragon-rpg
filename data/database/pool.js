const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const pg = require('pg');
const config = require(join(appDir, 'config.json'));

const db = new pg.Pool({
  user: config.pguser,
  host: config.pgserv,
  database: config.pgdb,
  password: config.pgpass,
  port: config.pgport
});

db.connect(err => {
  if (err) return console.error('Could not connect to database', err);
});

module.exports = db;
