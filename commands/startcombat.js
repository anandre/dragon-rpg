const { Command } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class StartCombatCommand extends Command {
    constructor() {
        super('startcombat', {
            aliases: ['startcombat', 'scombat'],
            channel: 'guild',
            category: 'rpg',
            description: {
                content: 'Start combat by yourself or with a group - larger groups have more and tougher enemies, but can also lead to greater glory!',
                usage: 'startcombat [user] [user] [user] [user]',
                example: 'startcombat @Mark#2320'
            },
            args: [
                {
                    id: 'group',
                    type: 'users'
                }
            ]
        })
    }

    async exec(message, args) {
        if (this.client.combat.has(message.author.id)) return;
        console.log('starting combat');
        //if (args.group.size > 0) return message.channel.send('This isn\'t enabled yet!');
        
        const player = (await this.client.db.query('SELECT * FROM players WHERE playerid = $1', [message.author.id])).rows[0]
        console.log(player)
        
        const enemyRarityObject = { 
            0: 'c',
            1: 'c',
            2: 'c',
            3: 'c',
            4: 'c',
            5: 'c',
            6: 'c',
            7: 'u',
            8: 'u',
            9: 'u',
            10: 'b'
        }
        const enemyRarity = enemyRarityObject[Math.floor(Math.random() * 10 + 1)]
        console.log(enemyRarity);
        console.log(player.level);
        const enemy = this.client.enemyInfo.filter(r => r.rank <= player.level).random();
        console.log(enemy);
        const abi = this.client.infoItems.get(player.weaponid).abilities.concat(this.client.infoItems.get(player.armorid).abilities);
        const cds = abi.map(a => this.client.abilities.get(a).cooldown);
        const enemycds = enemy.abilities.map(a => this.client.abilities.get(a).cooldown);
        console.log(`abiities: ${abi}`);
        try {
            console.log(enemy);
            await this.client.db.query('INSERT INTO combat (playerid, str, agi, con, mag, spr, currhp, maxhp, currmp, maxmp, abilities, weaponid, armorid, physdef, magdef, enemyid, enemyhp, enemymp, turn, cooldowns, enemycd) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)', [message.author.id, player.str, player.agi, player.con, player.mag, player.spr, player.currhp, player.maxhp, player.currmp, player.maxmp, abi, player.weaponid, player.armorid, player.physdef, player.magdef, enemy.enemyid, enemy.hp, enemy.mp, 1, cds, enemycds])
            this.client.combat.set(message.author.id, {
                str: player.str,
                agi: player.agi,
                con: player.con,
                mag: player.mag,
                spr: player.spr,
                currhp: player.currhp,
                maxhp: player.maxhp,
                currmp: player.currmp,
                maxmp: player.maxmp,
                physdef: player.physdef,
                magdef: player.magdef,
                abilities: abi,
                weaponid: player.weaponid,
                armorid: player.armorid,
                enemyid: enemy.enemyid,
                enemyhp: enemy.hp,
                enemymp: enemy.mp,
                turn: 1,
                cooldowns: cds,
                enemycd: enemycds
            });
            const embed = new MessageEmbed()
                .setTitle(`Combat against ${enemy.name} has begun!`)
                .addField(`**${message.author.username}**`, `❤ HP: ${player.currhp}/${player.maxhp}\n✨ MP: ${player.currmp}/${player.maxmp}\n💥 Abilities: ${abi.join(', ')}`, true)
                .addField(`**${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)}**`, `❤ HP: ${enemy.hp}\n✨ MP: ${enemy.mp}`, true)
            return message.channel.send(embed);
        }
        catch (e) {
            return message.channel.send(`${message.author.username}, there was an error starting combat!
            ${e.message}
            ${e.stack}`);

        }

    }
}

module.exports = StartCombatCommand