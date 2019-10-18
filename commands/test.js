const { Command } = require('discord-akairo');
const { Collection } = require('discord.js');
const { stripIndents } = require('common-tags');

class TestCommand extends Command {
  constructor() {
    super('test', {
      aliases: ['test', 't'],
      ownerOnly: true
    })
  }

  async *args(message, parsed, state) {
    let players = yield {
      type: 'users'
    }
    if (!players) players = new Collection();
    players.set(message.author.id, message.author);

    return { players };
  }

  async exec(message, { players }) {
    await this.client.readyCheck(message, players);
    const combat = this.client.combat.get(players.keyArray().join('-'));

    /*let startMessage = '';
    for (const fighter of startInits.filter(i => i.init)) {
      startMessage += `**${fighter.side === 'monster' ? fighter.target : fighter.name} Init**: ${fighter.init}\n`
    }
    const startEmbed = this.client.combatEmbed(combat);

    startEmbed.addField('\u200b', startMessage);
    await message.channel.send({ embed: startEmbed }); */
    do {
      if (combat.find(t => t.constructor.name === 'Number') === 1) {
        const startInits = this.client.generateInit(combat);
        const startEmbed = this.client.combatEmbed(combat);

        let startInitMessage = ''
        for (const fighter of startInits.filter(i  => i.init)) {
          startInitMessage += `**${fighter.side === 'monster' ? fighter.target : fighter.name} Init**: ${fighter.init}\n`
        }
        startEmbed.description += `\n${startInitMessage}`
        await message.channel.send({ embed: startEmbed });

        const attacks = await this.client.fighterPrompt(combat, message);
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
      /*const inits = this.client.generateInit(combat);
      const embed = this.client.combatEmbed(combat);

      let initMessage = ''
      for (const fighter of inits.filter(i  => i.init)) {
        initMessage += `**${fighter.side === 'monster' ? fighter.target : fighter.name} Init**: ${fighter.init}\n`
      }
      embed.description += `\n${initMessage}`
      if (combat.find(t => t.constructor.name === 'Number') === 1) {
        await message.channel.send(embed) 
      }
      

      const attacks = await this.client.fighterPrompt(combat, message);*/
    } while (combat.filter(f => f.currHP || f.currHP === 0).every(f => f.currHP > 0));
    if (combat.filter(f => f.side === 'player').every(f => f.currHP <= 0)) {
      this.client.combat.delete(players.keyArray().join('-'));
      return message.channel.send('players lose');
    }
    if (combat.filter(f => f.side === 'monster').every(f => f.currHP <= 0)) {
      this.client.combat.delete(players.keyArray().join('-'));
      return message.channel.send('enemies lose');
    }
    /*
    const inits = this.client.generateInit(combat);
    
    const embed = this.client.combatEmbed(combat);
    

    await message.channel.send(embed);
    
    //await message.channel.send(initMessage);

    
    await message.channel.send(attacks.join('\n'));

    if (combat.filter(f => f.currHP).every(f => f.currHP > 0)) {
      combat[combat.findIndex(t => t.constructor.name === 'Number')]++;
      const newTurnEmbed = this.client.combatEmbed(combat);
      const newInits = this.client.generateInit(combat);
      let newInitMessage = '';
      for (const fighter of newInits.filter(i => i.init)) {
        newInitMessage += `**${fighter.side === 'monster' ? fighter.target : fighter.name} Init**: ${fighter.init}\n`
      }
      newTurnEmbed.addField(attacks.join('\n'), newInitMessage);
      await message.channel.send({ embed: newTurnEmbed })
    }*/
  }
}

module.exports = TestCommand;