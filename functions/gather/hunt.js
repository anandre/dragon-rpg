const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const db = require(join(appDir, '/data/database/pool.js'));
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));

const hunt = async function(userid, messageTime, gold) {
  const end = [];
  const xp = Math.floor(Math.random() * 2 + 1);
  const items = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()];
  let query = 'INSERT INTO inventory (playeritem, playerid, itemid, count) VALUES ';
  const params = [];

  for (const item of items) {
    if (item > 0.95) {
      const result = dataManager.filter(i => i.rarity === 1 && i.source === 'hunting').random();
      const amt = Math.floor(Math.random() * 2 + 1);
      if (end.indexOf(result.name) === -1) {
        end.push(result.name, amt, result.id);
      }
      else {
        end[end.indexOf(result.name) + 1] += amt;
      }
    }
    else if (item > 0.10) {
      const result = dataManager.filter(i => i.rarity === 2 && i.source === 'hunting').random();
      const amt = Math.floor(Math.random() * 4 + 1);
      if (end.indexOf(result.name) === -1) {
        end.push(result.name, amt, result.id);
      }
      else {
        end[end.indexOf(result.name) + 1] += amt;
      }
    }
  }

  for (let i = 0, k = 0; i < end.length; i += 3, k += 4) {
    if (i === end.length - 3) {
      query += `($${k + 1}, $${k + 2}, $${k + 3}, $${k + 4})`;
    }
    else {
      query += `($${k + 1}, $${k + 2}, $${k + 3}, $${k + 4}), `;
    }

    params.push(`${userid}-${end[i + 2]}`, userid, end[i + 2], end[i + 1]);
  }

  query += ' ON CONFLICT (playeritem) DO UPDATE SET count = (inventory.count + excluded.count)';

  await db.query(`${query}`, params);
  await db.query(`
    UPDATE
      players
    SET
      hunttimer = $1,
      xp = (xp + $2),
      gold = (gold + $3)
    WHERE
      playerid = $4`,
  [messageTime, xp, gold, userid]);

  return end;
};

module.exports = hunt;