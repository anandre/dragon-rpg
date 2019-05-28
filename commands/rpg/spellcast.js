const { Command } = require('discord-akairo');

class SpellcastCommand extends Command {
  constructor() {
    super('spell', {
      description: {
        content: 'handles casting abilities'
      }
    })
  }
  
  async *args(message, parsed, state) {
    const usedAbility = yield {
      type: 'string'
    }

    return { usedAbility };
  }

  async exec(message, { usedAbility }) {
    const ability = this.client.abilities.get(usedAbility);
    if (ability.type === 'd') {
      
    }
  }
}