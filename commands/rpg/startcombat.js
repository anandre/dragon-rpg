const { Command } = require('discord-akairo');
const { MessageEmbed, Collection } = require('discord.js');
const {stripIndents } = require('common-tags');

class StartCombatCommand extends Command {
  constructor() {
    super('startcombat', {
      aliases: ['startcombat', 'scombat', 'sc'],
      channel: 'guild',
      category: 'rpg',
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
      description: {
        content: 'Start combat by yourself or with a group - larger groups have more and tougher enemies, but can also lead to greater glory!',
        usage: 'startcombat [user] [user] [user] [user]',
        example: stripIndents`startcombat
          startcombat @Mark#2320`
      }
    })
  }

  async *args(message, parsed, state) {
    let users = yield {
      type: 'users'
    }

    if (!users) users = new Collection();
    users.set(message.author.id, message.author)

    return { users };
  }

  async exec(message, { users }) {
    await this.client.readyCheck(message, users);

    const combat = this.client.combat.get(users.keyArray().join('-'));
    if (!combat) return;

    do {
      if (combat.find(t => t.constructor.name === 'Number') === 1) {
        const startInits = this.client.generateInit(combat);
        const startEmbed = this.client.combatEmbed(combat);

        let startInitMessage = ''
        for (const fighter of startInits.filter(i  => i.init)) {
          startInitMessage += `**${fighter.side === 'monster' ? `${fighter.name}** ${fighter.id}**` : fighter.name} Init**: ${fighter.init}\n`
        }
        startEmbed.description += `\n${startInitMessage}`
        await message.channel.send({ embed: startEmbed });
        console.log(1)
        const attacks = await this.client.fighterPrompt(combat, message);
        console.log(2)
        combat[combat.findIndex(t => t.constructor.name === 'Number')]++;
        const nextInits = this.client.generateInit(combat);
        const nextEmbed = this.client.combatEmbed(combat);
        let nextInitMessage = ''
        for (const fighter of nextInits.filter(i => i.init)) {
          nextInitMessage += `**${fighter.side === 'monster' ? fighter.target : fighter.name} Init**: ${fighter.init}\n`
        }
        nextEmbed.description = attacks.join('\n') + `\n\n${nextEmbed.description}`;
        nextEmbed.description += `\n\n${nextInitMessage}`;
        await message.channel.send({ embed: nextEmbed });
      }
      else {
        const attacks = await this.client.fighterPrompt(combat, message);
        const nextInits = this.client.generateInit(combat);
        const nextEmbed = this.client.combatEmbed(combat);
        let nextInitMessage = ''
        for (const fighter of nextInits.filter(i => i.init)) {
          nextInitMessage += `**${fighter.side === 'monster' ? fighter.target : fighter.name} Init**: ${fighter.init}\n`
        }
        nextEmbed.description = attacks.join('\n') + `\n\n${nextEmbed.description}`;
        nextEmbed.description += `\n\n${nextInitMessage}`;
        await message.channel.send({ embed: nextEmbed });
      }
    } while (combat.filter(f => f.currHP || f.currHP === 0).every(f => f.currHP > 0));
    if (combat.filter(f => f.side === 'player').every(f => f.currHP <= 0)) {
      this.client.combat.delete(players.keyArray().join('-'));
      return message.channel.send('players lose');
    }
    if (combat.filter(f => f.side === 'monster').every(f => f.currHP <= 0)) {
      this.client.combat.delete(players.keyArray().join('-'));
      return message.channel.send('enemies lose');
    }
  }
}

module.exports = StartCombatCommand