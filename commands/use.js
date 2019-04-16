const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

class UseCommand extends Command {
    constructor() {
        super('use', {
            aliases: ['use'],
            channel: 'guild',
            category: 'rpg',
            description: {
                content: 'Use an item to restore HP or MP.  If in combat, it will always use 1 item per use.',
                usage: 'use (item name) [amount]',
                example: 'use mushrooms'
            },
            
        })
    }

    async *args(message, parsed, state) {
        const amount = yield {
            type: 'integer',
            unordered: true,
            default: 1
        };
        const used = [... state.usedIndices][0];

        let item = parsed.phrases.map(x => x.raw.trim());
        if (typeof used != 'undefined') {
            item.splice(used, 1);
        };
        item = item.join(' ');

        return { amount, used, item };
    }

    async exec(message, { amount, used, item }) {
        if (!this.client.infoItems.filter(i => i.effects).some(i => [i.id, i.name].includes(item))) return;
        const usedItem = this.client.infoItems.find(i => i.id === item) || this.client.infoItems.find(i => i.name === item);
        const inventory = (await this.client.db.query(`SELECT inventory.count, items.itemid, items.name FROM inventory INNER JOIN items ON inventory.itemid = items.itemid WHERE inventory.playerid = '${message.author.id}'`)).rows
        const foundItem = inventory.find(i => i.itemid === usedItem.itemid)

        if (!inventory.some(i => i.itemid === usedItem.itemid)) return message.channel.send(`${message.author.username}, you don't have that item!`);
        if (amount > foundItem.count) return message.channel.send(`${message.author.username}, you don't have enough ${usedItem.name}.`);
        
        const effect = usedItem.effects.match(/[\d]+-[\d]+/g)[0].split('-').map(e => parseInt(e));
        const type = usedItem.effects.match(/HP|MP/g)[0];

        const transfer = {
            HP: 'currhp',
            MP: 'currmp'
        }

        console.log(transfer[type]);
        if (this.client.combat.has(message.author.id)) {
            if (usedItem.combat === 'n') return message.channel.send(`${message.author.username}, that item is not usable in combat.`);
            amount = 1;
            const player = this.client.combat.get(message.author.id);
            const enemy = this.client.enemyInfo.get(player.enemyid);
            const playerInit = Math.floor(Math.random() * 10) + 1 + player.agi;
            const enemyInit = Math.floor(Math.random() * 10) + 1 + enemy.agi;
            if (playerInit >= enemyInit) { //player uses item first
                let i = 0;
                let totalRestored = 0;
                while (i < amount) {
                    totalRestored += Math.floor(Math.random() * (effect[1] - effect[0] + 1) + effect[0]);
                    i++;
                };
                if (type === 'HP') {
                    player.currhp = Math.min(player.maxhp, math.currhp + totalRestored);
                }
                else {
                    player.currmp = Math.min(player.maxmp, math.currmp + totalRestored);
                }
                if (usedItem.count - amount === 0) {
                    console.log('delete')
                    await this.client.db.query(`DELETE FROM ${'inv' + message.author.id} WHERE itemid = ${usedItem.itemid}`);
                }
                else {
                    console.log('update')
                    await this.client.db.query(`UPDATE ${'inv' + message.author.id} SET ${usedItem.itemid} = ${foundItem.count - amount} WHERE itemid = ${usedItem.itemid}`)
                }
                const enemyDmg = await this.client.enemyBasicAttack(enemy, player);
                if (this.client.combat.get(message.author.id).currhp > 0) { //player survives, turn increments
                    await this.client.turnIncrement(player, enemy);
                    const embed = new MessageEmbed()
                        .setColor('BLUE')
                        .setTitle(`${message.author.username}'s combat against ${enemy.name}!`)
                        .setDescription(stripIndents`${message.author.username} used ${item} and healed ${totalRestored} ${type}!
                        ${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)} attacked and dealt ${enemyDmg} damage!`)
                        .addField(`**${message.author.username}**`, `❤ HP: ${this.client.combat.get(message.author.id).currhp}/${this.client.combat.get(message.author.id).maxhp}\n✨ MP: ${this.client.combat.get(message.author.id).currmp}/${this.client.combat.get(message.author.id).maxmp}\n💥 Abilities: ${player.abilities.join(', ')}`, true)
                        .addField(`**${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)}**`, `❤ HP: ${this.client.combat.get(message.author.id).enemyhp}\n✨ MP: ${this.client.combat.get(message.author.id).enemymp}`, true)
                        .setFooter(`Current turn: ${this.client.combat.get(message.author.id).turn}`)
                    return message.channel.send(embed);
                }
                else { //player dies
                    await this.client.db.query('DELETE FROM combat WHERE playerid = $1', [message.author.id]);
                    await this.client.db.query(`UPDATE players SET currhp = div(maxhp, 2), currmp = (maxmp, 2) WHERE playerid = '${message.author.id}'`);
                    this.client.combat.delete(message.author.id);
                    const embed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle(`${message.author.username}'s combat against ${enemy.name}!`)
                        .addField('\u200b', stripIndents`${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)} has defeated ${message.author.username}!
                        
                        Rest and recover, ${message.author.username}, and do not fear to try again!`)
                    return message.channel.send(embed);
                }
            }
            else { //enemy goes first
                const enemyDmg = await this.client.enemyBasicAttack(enemy, player);
                if (this.client.combat.get(message.author.id).currhp > 0) { //player survives, uses item
                    let i = 0;
                    let totalRestored = 0;
                    while (i < amount) {
                        totalRestored += Math.floor(Math.random() * (effect[1] - effect[0] + 1) + effect[0]);
                        i++;
                    };
                    if (type === 'HP') {
                        player.currhp = Math.min(player.maxhp, math.currhp + totalRestored);
                    }
                    else {
                        player.currmp = Math.min(player.maxmp, math.currmp + totalRestored);
                    }
                    if (usedItem.count - amount === 0) {
                        console.log('delete')
                        await this.client.db.query(`DELETE FROM ${'inv' + message.author.id} WHERE itemid = ${usedItem.itemid}`);
                    }
                    else {
                        console.log('update')
                        await this.client.db.query(`UPDATE ${'inv' + message.author.id} SET ${usedItem.itemid} = ${foundItem.count - amount} WHERE itemid = ${usedItem.itemid}`)
                    }
                    await this.client.turnIncrement(player, enemy);
                    const embed = new MessageEmbed()
                        .setColor('BLUE')
                        .setTitle(`${message.author.username}'s combat against ${enemy.name}!`)
                        .setDescription(stripIndents`${message.author.username} used ${item} and healed ${totalRestored} ${type}!
                        ${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)} attacked and dealt ${enemyDmg} damage!`)
                        .addField(`**${message.author.username}**`, `❤ HP: ${this.client.combat.get(message.author.id).currhp}/${this.client.combat.get(message.author.id).maxhp}\n✨ MP: ${this.client.combat.get(message.author.id).currmp}/${this.client.combat.get(message.author.id).maxmp}\n💥 Abilities: ${player.abilities.join(', ')}`, true)
                        .addField(`**${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)}**`, `❤ HP: ${this.client.combat.get(message.author.id).enemyhp}\n✨ MP: ${this.client.combat.get(message.author.id).enemymp}`, true)
                        .setFooter(`Current turn: ${this.client.combat.get(message.author.id).turn}`)
                    return message.channel.send(embed);
                }
                else { //player dies
                    await this.client.db.query('DELETE FROM combat WHERE playerid = $1', [message.author.id]);
                    await this.client.db.query(`UPDATE players SET currhp = div(maxhp, 2), currmp = (maxmp, 2) WHERE playerid = '${message.author.id}'`);
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
        else {
            let i = 0;
            let totalRestored = 0;
            while (i < amount) {
                totalRestored += Math.floor(Math.random() * (effect[1] - effect[0] + 1) + effect[0]);
                i++;
            };

            try {
                if (type === 'HP') {
                    await this.client.db.query(`UPDATE players SET currhp = LEAST(maxhp, (currhp + ${totalRestored})) WHERE playerid = '${message.author.id}'`); 
                }
                else {
                    await this.client.db.query(`UPDATE players SET currmp = LEAST(maxmp, (currmp + ${totalRestored})) WHERE playerid = '${message.author.id}'`);
                }
                if (usedItem.count - amount === 0) {
                    console.log('delete')
                    await this.client.db.query(`DELETE FROM ${'inv' + message.author.id} WHERE itemid = ${usedItem.itemid}`);
                }
                else {
                    console.log('update')
                    await this.client.db.query(`UPDATE ${'inv' + message.author.id} SET ${usedItem.itemid} = ${foundItem.count - amount} WHERE itemid = ${usedItem.itemid}`)
                }
                
                message.channel.send(`${message.author.username}, you used ${amount} ${item} and restored ${totalRestored} ${type}.`)
            }
            catch (e) {
                message.channel.send(stripIndents`${e.message}
                ${e.stack}`, { code: 'xxl' });
            }
        }
    }
}

module.exports = UseCommand;