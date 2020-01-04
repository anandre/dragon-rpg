const { Listener } = require('discord-akairo');
const { Collection, MessageEmbed } = require('discord.js');
const statuses = require('../data/statuses.json');
const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const db = require(join(appDir, '/data/database/pool.js'));

class ReadyListener extends Listener {
  constructor() {
    super('ready', {
      emitter: 'client',
      event: 'ready'
    });
  }

  async exec() {
    console.log(`Online at ${new Date()}.`);
    try {
      await this.client.user.setActivity(`@${this.client.user.username} help`, { type: 'WATCHING' });

      // guild settings - prefix and channels to run in
      const gSettings = (await db.query('SELECT * FROM guildsettings')).rows;

      this.client.guildSettings = new Collection();
      for (const guild of gSettings) {
        const settings = {
          id: guild.guildid,
          prefix: guild.prefix,
          channel: guild.channel
        };
        this.client.guildSettings.set(guild.guildid, settings);
      }

      // check for guilds joined while not on-line, then add default configs for each
      const newGuilds = this.client.guilds.filter(g => !this.client.guildSettings.has(g.id)).array();

      let query = 'INSERT INTO guildsettings (guildid, prefix, channel) VALUES ';
      const params = [];

      for (let i = 0, k = 0; i < newGuilds.length; i++, k += 3) {
        if (i === newGuilds.length - 1) {
          query += `($${k + 1}, $${k + 2}, $${k + 3})`;
        }
        else {
          query += `($${k + 1}, $${k + 2}, $${k + 3}), `;
        }
        params.push(`${newGuilds[i].id}`, '{";"}', '{}');
        this.client.guildSettings.set(newGuilds[i].id, { id: newGuilds[i].id, prefix: [';'], channel: [] });
      }

      query += ' ON CONFLICT (guildid) DO NOTHING';

      if (params.length > 1) {
        await db.query(`${query}`, params);
        const embed = new MessageEmbed()
          .setColor('GREEN')
          .setTitle(`Joined ${newGuilds.join(', ')} while offline.`);
        this.client.channels.get('550762593443250186').send(embed);
        // await this.client.channels.get('550762593443250186').send(`Joined ${newGuilds.join(', ')} while offline.`)
      }

      // check for guilds left while not on-line, then remove configs for each
      const deletedGuilds = this.client.guildSettings.filter(g => !this.client.guilds.has(g.id));
      const toDelete = `${deletedGuilds.map(x => x.id).join('\', \'')}`;
      if (deletedGuilds.size > 0) {
        for (const guild of this.client.guildSettings.filter(g => !this.client.guilds.has(g.id))) {
          this.client.guildSettings.delete(guild.id);
        }
        const delQuery = `DELETE FROM guildsettings WHERE guildid IN ('${toDelete}')`;
        await db.query(`${delQuery}`);
        const embed = new MessageEmbed()
          .setColor('RED')
          .setTitle(`Left ${toDelete.replace(/[()]/g, '')} while offline.`);
        await this.client.channels.get('550762593443250186').send(embed);
        // await this.client.channels.get('550762593443250186').send(`Left ${toDelete.replace(/[()]/g, '')} while offline.`)
      }

      // players - used to check if the user has a character started
      this.client.players = (await db.query('SELECT playerid FROM players')).rows.map(p => p.playerid);

      // statuses - for information command, combat use
      this.client.statuses = new Collection();
      for (const status of statuses) {
        this.client.statuses.set(status.name, status);
      }
    }
    catch (e) {
      console.log(`Error starting up:
      ${e.message}
      ${e.stack}`);
    }
  }
}

module.exports = ReadyListener;