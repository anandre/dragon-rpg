const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class StatusCommand extends Command {
  constructor() {
    super('status', {
      aliases: ['status'],
      description: {
        content: 'Shows your HP/MP, enemy\'s HP/MP, and current turn of your combat.',
        usage: 'status',
        example: 'status'
      }
    })
  }

  async exec(message) {
    if (!this.client.combat.has(message.author.id)) return;
    const player = this.client.combat.get(message.author.id);
    const enemy = this.client.enemies.get(player.enemyid);
    const embed = new MessageEmbed()
      .setTitle(`${message.author.username}'s combat against ${enemy.name}!`)
      .addField(`**${message.author.username}**`, `❤ HP: ${player.currHP}/${player.maxhp}\n✨ MP: ${player.currMP}/${player.maxmp}\n💥 Abilities: ${player.abilities.join(', ')}`, true)
      .addField(`**${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)}**`, `❤ HP: ${player.enemyhp}\n✨ MP: ${player.enemymp}`, true)
      .setFooter(`Current turn: ${player.turn}`)
    return message.channel.send(embed);
  }
}

module.exports = StatusCommand;