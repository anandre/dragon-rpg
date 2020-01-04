const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const db = require(join(appDir, '/data/database/pool.js'));
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));

class InventoryCommand extends Command {
  constructor() {
    super('inventory', {
      aliases: ['inventory', 'i', 'inv'],
      channel: 'guild',
      category: 'rpg',
      description: {
        content: 'List your inventory items',
        usage: 'List your inventory items',
        example: 'inventory'
      }
    });
  }

  async exec(message) {
    const inv = (await db.query(`
      SELECT
        inventory.count, inventory.itemid
      FROM
        inventory
      WHERE
        inventory.playerid = $1
      ORDER BY
        inventory.itemid ASC`,
    [message.author.id])).rows;
    const inventory = inv.map(i => i = `${dataManager.items.get(i.itemid).name} - ${i.count}\n`);
    const embed = new MessageEmbed()
      .setColor('#e00808')
      .setTitle(message.author.username + '\'s inventory')
      .setFooter('Information retrieved at:')
      .setTimestamp()
      .setThumbnail(message.author.displayAvatarURL());
    let invstr = '';
    for(let i = 0; i < inv.length; i++) {
      invstr += `${inv[i].name} - ${inv[i].count}\n`;
    }
    if (invstr.length > 1) {
      embed.addField('\u200b', inventory.join(' '));
    }
    message.channel.send({ embed: embed });
  }
}

module.exports = InventoryCommand;