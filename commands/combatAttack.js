const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

class AttackCommand extends Command {
    constructor() {
        super('attack', {
            aliases: ['attack'],
            args: [
                {
                    id: 'target',
                    type: 'number',
                    default: 1
                }
            ]
        })
    }

    async exec(message, { target }) {
        if (!this.client.combat.has(message.author.id)) return;
        const player = this.client.combat.get(message.author.id);
        const enemy = this.client.enemyInfo.get(player.enemyid);
        const weapon = this.client.infoItems.get(player.weaponid);
        const playerInit = Math.floor(Math.random() * 10) + 1 + player.agi;
        const enemyInit = Math.floor(Math.random() * 10) + 1 + enemy.agi;
        if (playerInit >= enemyInit) { //player goes first, player attacks
            const playerDmg = await this.client.playerBasicAttack(player, weapon, enemy);
            if (this.client.combat.get(message.author.id).enemyhp > 0) { //enemy is still alive, enemy attacks
                const enemyDmg = await this.client.enemyBasicAttack(enemy, player);
                if (this.client.combat.get(message.author.id).currhp > 0) { //player is still alive, set new turn after both attacks
                    this.client.combat.get(message.author.id).turn++;
                    if (this.client.combat.get(message.author.id).turn % 5 === 0) { //turn is 5/10/15/etc, update database
                        const update = this.client.combat.get(message.author.id);
                        await this.client.db.query('UPDATE combat SET currhp = $1, currmp = $2, enemyhp = $3, enemymp = $4, turn = $5 WHERE playerid = $6', [update.currhp, update.currmp, update.enemyhp, update.enemymp, update.turn, update.playerid])
                    }
                    const embed = new MessageEmbed()
                        .setColor('BLUE')
                        .setTitle(`${message.author.username}'s combat against ${enemy.name}!`)
                        .setDescription(stripIndents`${message.author.username} has dealt ${playerDmg} damage!
                        ${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)} has done ${enemyDmg} damage!`)
                        .addField(`**${message.author.username}**`, `❤ HP: ${this.client.combat.get(message.author.id).currhp}/${this.client.combat.get(message.author.id).maxhp}\n✨ MP: ${this.client.combat.get(message.author.id).currmp}/${this.client.combat.get(message.author.id).maxmp}\n💥 Abilities: ${player.abilities.join(', ')}`, true)
                        .addField(`**${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)}**`, `❤ HP: ${this.client.combat.get(message.author.id).enemyhp}\n✨ MP: ${this.client.combat.get(message.author.id).enemymp}`, true)
                        .setFooter(`Current turn: ${this.client.combat.get(message.author.id).turn}`)
                    return message.channel.send(embed);        
                }
                else { //enemy defeats player
                    await this.client.db.query('DELETE FROM combat WHERE playerid = $1', [message.author.id]);
                    const hpCheck = (await this.client.db.query('SELECT maxhp, maxmp FROM players WHERE playerid = $1', [message.author.id])).rows[0]
                    await this.client.db.query('UPDATE players SET currhp = $1, currmp = $2 WHERE playerid = $3', [Math.floor(hpCheck.maxhp/2), Math.floor(hpCheck.maxmp/2), message.author.id]);
                    this.client.combat.delete(message.author.id);
                    const embed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle(`${message.author.username}'s combat against ${enemy.name}!`)
                        .addField('\u200b', stripIndents`${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)} has defeated ${message.author.username}!
                        
                        Rest and recover, ${message.author.username}, and do not fear to try again!`)
                    return message.channel.send(embed);
                }
            }
            else { //player defeats enemy
                const update = this.client.combat.get(message.author.id);
                const hpCheck = (await this.client.db.query('SELECT maxhp, maxmp, xp, gold FROM players WHERE playerid = $1', [message.author.id])).rows[0];
                await this.client.db.query('UPDATE players SET currhp = $1, currmp = $2, xp = $3, gold = $4 WHERE playerid = $5', [Math.min(update.currhp, hpCheck.maxhp), Math.min(update.currmp, hpCheck.maxmp), hpCheck.xp + enemy.xp, hpCheck.gold + enemy.gold, message.author.id]);
                await this.client.db.query('DELETE FROM combat WHERE playerid = $1', [message.author.id]);
                this.client.combat.delete(message.author.id);
                const embed = new MessageEmbed()
                    .setColor('GREEN')
                    .setTitle(`${message.author.username}'s combat against ${enemy.name}!`)
                    .addField(`${message.author.username} has defeated ${enemy.name}!`, `They have found ${enemy.gold} gold and earned ${enemy.xp} experience!`)
                message.channel.send(embed);
                //await this.client.checkXP(message);
            }
        }
        else { //enemy attacks first
            const enemyDmg = await this.client.enemyBasicAttack(enemy, player);
            if (this.client.combat.get(message.author.id).currhp > 0) { //player is still alive, player attacks
                const playerDmg = await this.client.playerBasicAttack(player, weapon, enemy);
                if (this.client.combat.get(message.author.id).enemyhp > 0) { //enemy is still alive, set new turn after both attack
                    this.client.combat.get(message.author.id).turn++;
                    if (this.client.combat.get(message.author.id).turn % 5 === 0) { //turn is 5/10/15/etc, update database
                        const update = this.client.combat.get(message.author.id);
                        await this.client.db.query('UPDATE combat SET currhp = $1, currmp = $2, enemyhp = $3, enemymp = $4, turn = $5 WHERE playerid = $6', [update.currhp, update.currmp, update.enemyhp, update.enemymp, update.turn, update.playerid])
                    }
                    const embed = new MessageEmbed()
                        .setColor('BLUE')
                        .setTitle(`${message.author.username}'s combat against ${enemy.name}!`)
                        .setDescription(stripIndents`${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)} has done ${enemyDmg} damage!
                        ${message.author.username} has dealt ${playerDmg} damage!`)
                        .addField(`**${message.author.username}**`, `❤ HP: ${this.client.combat.get(message.author.id).currhp}/${this.client.combat.get(message.author.id).maxhp}\n✨ MP: ${this.client.combat.get(message.author.id).currmp}/${this.client.combat.get(message.author.id).maxmp}\n💥 Abilities: ${player.abilities.join(', ')}`, true)
                        .addField(`**${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)}**`, `❤ HP: ${this.client.combat.get(message.author.id).enemyhp}\n✨ MP: ${this.client.combat.get(message.author.id).enemymp}`, true)
                        .setFooter(`Current turn: ${this.client.combat.get(message.author.id).turn}`)
                    return message.channel.send(embed);      
                }
                else { //player defeats enemy
                    const update = this.client.combat.get(message.author.id);
                    const hpCheck = (await this.client.db.query('SELECT maxhp, maxmp, xp FROM players WHERE playerid = $1', [message.author.id])).rows[0];
                    await this.client.db.query('UPDATE players SET currhp = $1, currmp = $2, xp = $3, gold = $4 WHERE playerid = $5', [Math.min(update.currhp, hpCheck.maxhp), Math.min(update.currmp, hpCheck.maxmp), hpCheck.xp + enemy.xp, hpCheck.gold + enemy.gold, message.author.id]);
                    await this.client.db.query('DELETE FROM combat WHERE playerid = $1', [message.author.id]);
                    this.client.combat.delete(message.author.id);
                    const embed = new MessageEmbed()
                        .setColor('GREEN')
                        .setTitle(`${message.author.username}'s combat against ${enemy.name}!`)
                        .addField(`${message.author.username} has defeated ${enemy.name}!`, `They have found ${enemy.gold} gold and earned ${enemy.xp} experience!`)
                    message.channel.send(embed);
                    //await this.client.checkXp(message);
                }
            }
            else { //enemy defeats player
                await this.client.db.query('DELETE FROM combat WHERE playerid = $1', [message.author.id]);
                const hpCheck = (await this.client.db.query('SELECT maxhp, maxmp FROM players WHERE playerid = $1', [message.author.id])).rows[0]
                await this.client.db.query('UPDATE players SET currhp = $1, currmp = $2 WHERE playerid = $3', [Math.floor(hpCheck.maxhp/2), Math.floor(hpCheck.maxmp/2)], message.author.id);
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

module.exports = AttackCommand;