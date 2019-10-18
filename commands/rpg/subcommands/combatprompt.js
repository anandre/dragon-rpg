const { Command } = require('discord-akairo');

class CombatPrompt extends Command {
  constructor() {
    super('sCPrompt', {
      aliases: ['sCPrompt'],
    })
  }

  async *args(message, parsed, state) {
    const combat = this.client.combat.find(c => c.some(o => o.id === message.author.id));
    
    const response = yield {
      type: msg => {
        console.log(msg.content);
        const args = msg.content.trim().split(/ +/g);
        console.log(args);
        if (
          ['attack', 'att', 'a'].includes(args[0]) &&
          combat.some(i => i.id === args[1])
        ) {
          console.log(args);
          return `${message.author.id} attack ${args[1]}`;
        }

        if (
          ['cast', 'c'].includes(args[0]) &&
          combat.find(o => o.id === message.author.id).abilities.map(a => a.name).includes(args[1]) &&
          combat.some(o => o.id === args[2])
        ) {
          return args;
        }

        if (
          ['use', 'u'].includes(args[0]) &&
          (this.client.items.get(args[1]) || this.client.items.find(i => i.name === args[1]))
        ) {
          return args;
        }
        //return null; 
        },
      prompt: {
        retry: 'invalid input'
      }
    }

    return { response };
  }

  async exec(message, { response }) {
    message.channel.send(`accepted input: ${response}`)
  }
}

module.exports = CombatPrompt;