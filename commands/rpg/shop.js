const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

class ShopCommand extends Command {
  constructor() {
    super('shop', {
      aliases: ['shop'],
      channel: 'guild',
      category: 'rpg',
      description: {
        content: 'Displays items for sale at the local shop.  Items range from apprentice work to high quality weapons and armor.',
        usage: 'shop (weapon | armor | accessory)',
        example: 'shop weapons'
      },
      args: [
        {
          id: 'cat',
          type: 'string'
        }
      ]
    })
  }

  async exec(message, { cat }) {
    const type = {
      weapon: 'w',
      armor: 'a',
      accessory: 'c'
    };
    if (!type[cat]) return;
    const shop = this.client.shopItems.filter(i => i.slot === type[cat]).sort((a, b) => a.cost - b.cost).map(i => `**${i.name}** - ${i.cost}g`);
    const shopCols = this.client.shopArray(shop, 3);
    const embed = new MessageEmbed()
      .setColor('GOLD')
      .setTitle(`Currently viewing ${cat} in the shop.`)
      .addField('\u200b', shopCols[0].join('\n'), true)
      .addField('\u200b', shopCols[1].join('\n'), true)
      .addField('\u200b', shopCols[2].join('\n'), true)
    return message.channel.send(embed);
  }
}

module.exports = ShopCommand;