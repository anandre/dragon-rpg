const { Command } = require('discord-akairo');
const { Collection } = require('discord.js');
const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));
const db = require(join(appDir, '/data/database/pool.js'));

class TestCommand extends Command {
  constructor() {
    super('test', {
      aliases: ['test'],
      ownerOnly: true,
      category: 'owner'
    });
  }

  async exec(message) {
    const res = await db.query('UPDATE testxp SET level = level, xp = xp + $1 WHERE name = $2 RETURNING *', [3, 'mark']);
    message.channel.send(`${res.rows[0].name} ${res.rows[0].level} ${res.rows[0].xp}`);
  }
}

module.exports = TestCommand;