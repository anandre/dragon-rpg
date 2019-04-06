const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class CombatStatusCommand extends Command {
    constructor() {
        super('combatstatus', {
            //aliases: ['combatstatus'],
            description: {
                content: 'Shows the current state of your combat.',
                usage: 'combat status',
                example: 'combat status'
            }
        })
    }

    async exec(message) {
        if (!this.client.combat.has(message.author.id)) return;
        const player = this.client.combat.get(message.author.id);
        const enemy = this.client.enemyInfo.get(player.enemyid);
        const embed = new MessageEmbed()
            .setTitle(`${message.author.username}'s combat against ${enemy.name}!`)
            .addField(`**${message.author.username}**`, `❤ HP: ${player.currhp}/${player.maxhp}\n✨ MP: ${player.currmp}/${player.maxmp}\n💥 Abilities: ${player.abilities.join(', ')}`, true)
            .addField(`**${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)}**`, `❤ HP: ${player.enemyhp}\n✨ MP: ${player.enemymp}`, true)
            .setFooter(`Current turn: ${player.turn}`)
        return message.channel.send(embed);
    }
}

module.exports = CombatStatusCommand;