const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const db = require(join(appDir, '/data/database/pool.js'));

const gold = async function(userid) {
  const goldArray = [25, 25, 25, 50, 50, 100];
  const goldResult = goldArray[Math.floor(Math.random() * goldArray.length)];
  await db.query('UPDATE players SET gold = gold + $1 WHERE playerid = $2', [goldResult, userid]);
  return goldResult;
};

module.exports = gold;