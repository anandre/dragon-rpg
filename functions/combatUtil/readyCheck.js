const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const db = require(join(appDir, '/data/database/pool.js'));
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));

const readyCheck = async (message, players) => {
  if (!message.client.players.some(r => players.has(r)) || dataManager.combat.keyArray().map(a => a.split('-')).flat().some(r => players.has(r))) {
    return message.answer(message.author, 'one or more of the users cannot participate, either they\'re in combat already, or they aren\'t playing.');
  }
  await message.channel.send('All players need to respond with `ready` to start combat, or `cancel` to stop combat now.');
  const promises = [];
  for (const [id] of players) {
    const filter = m => m.author.id === id && ['cancel', 'ready'].includes(m.content.toLowerCase());
    promises.push(message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] }).then(msg => {
      if (msg.first().content.toLowerCase() === 'cancel') return Promise.reject(new Error('Combat has been canceled.'));
    }));
  }
  try {
    await Promise.all(promises);
    if (!message.client.players.some(r => players.has(r)) || dataManager.combat.keyArray().map(a => a.split('-')).flat().some(r => players.has(r))) {
      return message.answer(message.author, 'one or more of the users cannot participate, either they\'re in combat already, or they aren\'t playing.');
    }
    dataManager.combat.set(players.keyArray().join('-'), []);
    const thisCombat = dataManager.combat.get(players.keyArray().join('-'));
    const playerStats = (await db.query(`SELECT
        playerid, path, currhp, currmp, level, weaponid, armorid, accessoryid, xp, gold
      FROM
        players
      WHERE
        playerid IN ('${players.keyArray().join('\', \'')}')`)).rows;
    for (const fighter of playerStats) {
      const path = require(join(appDir, `/data/paths/${fighter.path.toLowerCase()}.js`));
      const combatant = new path({
        id: fighter.playerid,
        name: (await message.client.users.fetch(fighter.playerid)).username,
        level: fighter.level,
        xp: fighter.xp,
        gold: fighter.gold,
        weaponid: fighter.weaponid,
        armorid: fighter.armorid,
        accessoryid: fighter.accessoryid,
        currHP: fighter.currhp,
        currMP: fighter.currmp
      });
      combatant.side = 'player';
      thisCombat.push(combatant);

      const eData = dataManager.enemies.filter(e => e.level <= fighter.level).random();
      const enemy = new (require(join(appDir, `/data/enemies/${eData.rarity}/${eData.id}.js`)));

      enemy.side = 'monster';
      enemy.currHP = enemy.maxHP;
      enemy.currMP = enemy.maxMP;
      enemy.id = `${enemy.id}${thisCombat.filter(e => e.name === enemy.name && e.side === 'monster').length + 1}`;
      thisCombat.push(enemy);
    }
    thisCombat.push(1);
  }
  catch (error) {
    if (error === 'Combat has been canceled.') {
      return message.answer(message.author, 'one or more players is not ready for combat.');
    }
    else {
      message.answer(message.author, 'there was a problem starting combat.  Please report this in my support server, an invite can be found using the `invite` command.');
      console.log(error);
      message.client.commandHandler.emit('error', (message, error, message.client.commandHandler.modules.get('startcombat')));
    }
  }
};

module.exports = readyCheck;