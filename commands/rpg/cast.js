const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

class CastCommand extends Command {
  constructor() {
    super('cast', {
      aliases: ['ability', 'abi', 'cast'],
      channel: 'guild',
      category: 'rpg',
      description: {
        content: 'Use an ability in combat.',
        usage: 'ability (name) [target]',
        example: 'ability rush'
      },
      args: [
        {
          id: 'ability',
          type: 'phrase'
        },
        {
          id: 'target',
          type: 'number',
          default: 1
        }
      ]
    })
  }

    async exec(message, { ability, target }) {
        console.log('cast');
        if (!this.client.combat.has(message.author.id)) return;
        if (!this.client.combat.get(message.author.id).abilities.includes(ability)) return message.channel.send(`${message.author.username}, unknown ability, please try again.`);
        const usedAbility = this.client.abilities.get(ability);
        const player = this.client.combat.get(message.author.id);
        const enemy = this.client.enemyInfo.get(player.enemyid);
        const playerInit = Math.floor(Math.random() * 10) + 1 + player.agi;
        const enemyInit = Math.floor(Math.random() * 10) + 1 + enemy.agi;
        const cooldown = player.cooldowns[player.abilities.indexOf(ability)];
        console.log(player, enemy, usedAbility);
        if (cooldown === usedAbility.cooldown && player.currmp >= usedAbility.mana) { //ability can be used
            if (playerInit >= enemyInit) { //player goes first, uses ability
                    console.log(`using ability ${usedAbility.name}`)
                    if (usedAbility.type === 'd') { //ability is damaging
                        const playerDmg = await this.client.playerCastSingleDamage(player, enemy, usedAbility);
                        if (this.client.combat.get(message.author.id).enemyhp > 0) { //enemy survived, attacks
                            const enemyDmg = await this.client.enemyBasicAttack(enemy, player);
                            if (this.client.combat.get(message.author.id).currhp > 0) { //player survived, increment turn
                                await this.client.turnIncrement(player, enemy);
                                const embed = new MessageEmbed()
                                    .setColor('BLUE')
                                    .setTitle(`${message.author.username}'s combat against ${enemy.name}!`)
                                    .setDescription(stripIndents`${message.author.username} used ${usedAbility.name} and dealt ${playerDmg} damage!
                                    ${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)} attacked and dealt ${enemyDmg} damage!`)
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
                else if (usedAbility.type === 'h') { //player goes first, uses healing ability
                    const playerHeal = await this.client.playerCastSingleHeal(player, usedAbility);
                    const enemyDmg = await this.client.enemyBasicAttack(enemy, player);
                    if (this.client.combat.get(message.author.id).currhp > 0) { //enemy attacked, player survived
                        await this.client.turnIncrement(player, enemy);
                        /*this.client.combat.get(message.author.id).turn++;
                        if (this.client.combat.get(message.author.id).turn % 5 === 0) { //turn is 5/10/15/etc, update database
                            const update = this.client.combat.get(message.author.id);
                            await this.client.db.query('UPDATE combat SET currhp = $1, currmp = $2, enemyhp = $3, enemymp = $4, turn = $5 WHERE playerid = $6', [update.currhp, update.currmp, update.enemyhp, update.enemymp, update.turn, update.playerid])
                        }*/
                        const embed = new MessageEmbed()
                            .setColor('BLUE')
                            .setTitle(`${message.author.username}'s combat against ${enemy.name}!`)
                            .setDescription(stripIndents`${message.author.username} used ${usedAbility.name} and healed ${playerHeal} damage!
                            ${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)} attacked and dealt ${enemyDmg} damage!`)
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
                } //end of player heal first
                else if (usedAbility.type === 's') { //player uses support ability, need to add buffs/debuffs tracker
                    const enemyDmg = await this.client.enemyBasicAttack(enemy, player);
                    if (this.client.combat.get(message.author.id).currhp > 0) { //enemy attacked, player survived
                        await this.client.turnIncrement(player, enemy)
                        /*this.client.combat.get(message.author.id).turn++;
                        if (this.client.combat.get(message.author.id).turn % 5 === 0) { //turn is 5/10/15/etc, update database
                            const update = this.client.combat.get(message.author.id);
                            await this.client.db.query('UPDATE combat SET currhp = $1, currmp = $2, enemyhp = $3, enemymp = $4, turn = $5 WHERE playerid = $6', [update.currhp, update.currmp, update.enemyhp, update.enemymp, update.turn, update.playerid])
                        }*/
                        const embed = new MessageEmbed()
                            .setColor('BLUE')
                            .setTitle(`${message.author.username}'s combat against ${enemy.name}!`)
                            .setDescription(stripIndents`${message.author.username} used ${usedAbility.name}!
                            ${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)} attacked and dealt ${enemyDmg} damage!`)
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
            } //end of player going first
        else { //enemy goes first
            const enemyDmg = await this.client.enemyBasicAttack(enemy, player);
            if (this.client.combat.get(message.author.id).currhp > 0) { //player survived, uses ability
                if (usedAbility.type === 'd') { //player uses damaging spell
                    const playerDmg = await this.client.playerCastSingleDamage(player, enemy, usedAbility);
                    if (this.client.combat.get(message.author.id).enemyhp > 0) { //enemy survives, turn increments
                        await this.client.turnIncrement(player, enemy)
                        /*this.client.combat.get(message.author.id).turn++;
                        if (this.client.combat.get(message.author.id).turn % 5 === 0) { //turn is 5/10/15/etc, update database
                            const update = this.client.combat.get(message.author.id);
                            await this.client.db.query('UPDATE combat SET currhp = $1, currmp = $2, enemyhp = $3, enemymp = $4, turn = $5 WHERE playerid = $6', [update.currhp, update.currmp, update.enemyhp, update.enemymp, update.turn, update.playerid])
                        }*/
                        const embed = new MessageEmbed()
                            .setColor('BLUE')
                            .setTitle(`${message.author.username}'s combat against ${enemy.name}!`)
                            .setDescription(stripIndents`${message.author.username} used ${usedAbility.name} and dealt ${playerDmg} damage!
                            ${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)} attacked and dealt ${enemyDmg} damage!`)
                            .addField(`**${message.author.username}**`, `❤ HP: ${this.client.combat.get(message.author.id).currhp}/${this.client.combat.get(message.author.id).maxhp}\n✨ MP: ${this.client.combat.get(message.author.id).currmp}/${this.client.combat.get(message.author.id).maxmp}\n💥 Abilities: ${player.abilities.join(', ')}`, true)
                            .addField(`**${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)}**`, `❤ HP: ${this.client.combat.get(message.author.id).enemyhp}\n✨ MP: ${this.client.combat.get(message.author.id).enemymp}`, true)
                            .setFooter(`Current turn: ${this.client.combat.get(message.author.id).turn}`)
                        return message.channel.send(embed);
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
                else if (usedAbility.type === 'h') { //player uses a healing spell
                    const playerHeal = await this.client.playerCastSingleHeal(player, usedAbility);
                    await this.client.turnIncrement(player, enemy);
                    /*this.client.combat.get(message.author.id).turn++;
                    if (this.client.combat.get(message.author.id).turn % 5 === 0) { //turn is 5/10/15/etc, update database
                        const update = this.client.combat.get(message.author.id);
                        await this.client.db.query('UPDATE combat SET currhp = $1, currmp = $2, enemyhp = $3, enemymp = $4, turn = $5 WHERE playerid = $6', [update.currhp, update.currmp, update.enemyhp, update.enemymp, update.turn, update.playerid])
                    }*/
                    const embed = new MessageEmbed()
                        .setColor('BLUE')
                        .setTitle(`${message.author.username}'s combat against ${enemy.name}!`)
                        .setDescription(stripIndents`${message.author.username} used ${usedAbility.name} and healed ${playerHeal} damage!
                        ${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)} attacked and dealt ${enemyDmg} damage!`)
                        .addField(`**${message.author.username}**`, `❤ HP: ${this.client.combat.get(message.author.id).currhp}/${this.client.combat.get(message.author.id).maxhp}\n✨ MP: ${this.client.combat.get(message.author.id).currmp}/${this.client.combat.get(message.author.id).maxmp}\n💥 Abilities: ${player.abilities.join(', ')}`, true)
                        .addField(`**${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)}**`, `❤ HP: ${this.client.combat.get(message.author.id).enemyhp}\n✨ MP: ${this.client.combat.get(message.author.id).enemymp}`, true)
                        .setFooter(`Current turn: ${this.client.combat.get(message.author.id).turn}`)
                    return message.channel.send(embed);
                }
                else if (usedAbility.type === 's') { //player uses a support spell, need to add buff/debuff tracker
                    await this.client.turnIncrement(player, enemy);
                    /*this.client.combat.get(message.author.id).turn++;
                    if (this.client.combat.get(message.author.id).turn % 5 === 0) { //turn is 5/10/15/etc, update database
                        const update = this.client.combat.get(message.author.id);
                        await this.client.db.query('UPDATE combat SET currhp = $1, currmp = $2, enemyhp = $3, enemymp = $4, turn = $5 WHERE playerid = $6', [update.currhp, update.currmp, update.enemyhp, update.enemymp, update.turn, update.playerid])
                    }*/
                    const embed = new MessageEmbed()
                        .setColor('BLUE')
                        .setTitle(`${message.author.username}'s combat against ${enemy.name}!`)
                        .setDescription(stripIndents`${message.author.username} used ${ability.name}!
                        ${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)} attacked and dealt ${enemyDmg} damage!`)
                        .addField(`**${message.author.username}**`, `❤ HP: ${this.client.combat.get(message.author.id).currhp}/${this.client.combat.get(message.author.id).maxhp}\n✨ MP: ${this.client.combat.get(message.author.id).currmp}/${this.client.combat.get(message.author.id).maxmp}\n💥 Abilities: ${player.abilities.join(', ')}`, true)
                        .addField(`**${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)}**`, `❤ HP: ${this.client.combat.get(message.author.id).enemyhp}\n✨ MP: ${this.client.combat.get(message.author.id).enemymp}`, true)
                        .setFooter(`Current turn: ${this.client.combat.get(message.author.id).turn}`)
                    return message.channel.send(embed);
                }
            } //end of player survived enemy attack
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
        } //end of ability can be used
        else if (cooldown < usedAbility.cooldown) { //not off cooldown yet
            return message.channel.send(`${message.author.username}, ${usedAbility.name} ${cooldown === 0 ? 'is ready next turn!' : 'is not ready for ' + cooldown + ' turns!' }`);
        }
        else if (player.currmp < usedAbility.mana) { //not enough mana
            return message.channel.send(`${message.author.username}, you do not have enough mana to cast ${usedAbility.name}!`);
        }
    }
}

module.exports = CastCommand;