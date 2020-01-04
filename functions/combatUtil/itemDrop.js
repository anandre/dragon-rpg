const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const db = require(join(appDir, '/data/database/pool.js'));

const itemDrop = async (combat) => {
  const players = combat.filter(f => f.side === 'player');
  const enemies = combat.filter(f => f.side === 'monster');
  const items = [];
  const resArr = [];
  for (const enemy of enemies) {
    const res = Math.floor(Math.random() * 100) + 1;
    if (res < 5) {
      items.push(enemy.drops[2]);
    }
    else if (res < 20) {
      items.push(enemy.drops[1]);
    }
    else {
      items.push(enemy.drops[0]);
    }
  }
  for (const player of players) {
    const item = items[(Math.floor(Math.random() * items.length))];
    console.log(item);
    await db.query(`
    INSERT INTO
      inventory (playeritem, playerid, itemid, count)
    VALUES
      ($1, $2, $3, $4)
    ON CONFLICT (playeritem) DO UPDATE
    SET count = (inventory.count + excluded.count)`,
    [`${player.id}-${item.id}`, player.id, item.id, 1]);
    const index = items.findIndex(i => i.name === item.name);
    items.splice(index, 1);
    resArr.push(`${player.name} received ${item.name}`);
  }
  return resArr;
};

module.exports = itemDrop;