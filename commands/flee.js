const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

class FleeCommand extends Command {
    constructor() {
        super('flee', {
            aliases: ['flee', 'run'],
            channel: 'guild',
            category: 'rpg',
            description: {
                content: 'Attempt to flee from an enemy.  Only usable in single combat.  A character with a higher Agility has a better chance to flee.',
                usage: 'flee',
                example: 'flee'
            }
        })
    }

    async exec(message) {
        if (!this.client.combat.has(message.author.id)) return message.channel.send(`${message.author.username}, you are not in combat.`);
        const player = this.client.combat.get(message.author.id);
        const enemy = this.client.enemyInfo.get(player.enemyid);
        const run = this.client.flee(player, enemy);
        if (run) {
            await this.client.db.query(`UPDATE players SET currhp = LEAST(maxhp, ${player.currhp}), currmp = LEAST(maxmp, ${player.currmp}) WHERE playerid = '${message.author.id}'`);
            this.client.combat.delete(message.author.id);
            await this.client.db.query('DELETE FROM combat WHERE playerid = $1', [message.author.id]);
            const embed = new MessageEmbed()
                .setColor('GREEN')
                .setTitle(`${message.author.username}'s combat against ${enemy.name}!`)
                .setDescription(stripIndents`${message.author.username} successfully ran away!`)
            return message.channel.send(embed);
        }
        else {
            const enemyDmg = await this.client.enemyBasicAttack(enemy, player);
            const enemyDmg = await this.client.enemyBasicAttack(enemy, player);
            if (this.client.combat.get(message.author.id).currhp > 0) { //player survived, increment turn
                await this.client.turnIncrement(player, enemy);
                const embed = new MessageEmbed()
                    .setColor('BLUE')
                    .setTitle(`${message.author.username}'s combat against ${enemy.name}!`)
                    .setDescription(stripIndents`${message.author.username} tried to run but failed!
                    ${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)} attacked and dealt ${enemyDmg} damage!`)
                    .addField(`**${message.author.username}**`, `❤ HP: ${this.client.combat.get(message.author.id).currhp}/${this.client.combat.get(message.author.id).maxhp}\n✨ MP: ${this.client.combat.get(message.author.id).currmp}/${this.client.combat.get(message.author.id).maxmp}\n💥 Abilities: ${player.abilities.join(', ')}`, true)
                    .addField(`**${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)}**`, `❤ HP: ${this.client.combat.get(message.author.id).enemyhp}\n✨ MP: ${this.client.combat.get(message.author.id).enemymp}`, true)
                    .setFooter(`Current turn: ${this.client.combat.get(message.author.id).turn}`)
                return message.channel.send(embed);
            }
            else { //enemy defeats player
                await this.client.db.query('DELETE FROM combat WHERE playerid = $1', [message.author.id]);
                await this.client.db.query(`UPDATE players SET currhp = div(maxhp, 2), currmp = div(maxmp, 2) WHERE playerid = '${message.author.id}'`);
                this.client.combat.delete(message.author.id);
                const embed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle(`${message.author.username}'s combat against ${enemy.name}!`)
                    .addField('\u200b', stripIndents`${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)} has defeated ${message.author.username}!
            
                    Rest and recover, ${message.author.username}, and do not fear to try again!`)
                return message.channel.send(embed);
            }
        }
    }
}