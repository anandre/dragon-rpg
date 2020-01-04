const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const db = require(join(appDir, '/data/database/pool.js'));
const xpChart = require(join(appDir, '/functions/utility/xpChart.js'));

const addXP = async function(userid, xp) {
  const res = await db.query(`
    UPDATE
      players
    SET
      level = level, xp = xp + $1
    WHERE
      playerid = $2
    RETURNING
      *`, [xp, userid]);
  if (res.rows[0].xp >= xpChart[res.rows[0].level]) {
    const newLevel = parseInt(Object.entries(xpChart).find(a => a[1] >= res.rows[0].xp)[0]);
    await db.query(`
    UPDATE
      players
    SET
      level = $1
    WHERE
      playerid = $2`,
    [newLevel, userid]);
    return newLevel;
  }
  return null;
};

module.exports = addXP;