const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const db = require(join(appDir, '/data/database/pool.js'));

const levelUp = async function(userid, level) {

  return await message.channel.send(`You have leveled up!  Now level ${currXP.level + 1} with ${currXP.xp - client.levelChart[currXP.level]} XP!`);
};

module.exports = levelUp;