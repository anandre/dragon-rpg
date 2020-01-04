const { Listener } = require('discord-akairo');
const { stripIndents } = require('common-tags');

class CommandErrorListener extends Listener {
  constructor() {
    super('commandError', {
      emitter: 'commandHandler',
      event: 'error'
    });
  }

  async exec(error, message, command) {
    console.log(`error with ${message.content}`);
    return this.client.channels.get('547399254864560138').send(stripIndents`There was an error running ${command ? command.id : 'no command'} on ${message.guild.name}. \`\`\`xl
      ${error.message}
      ${error.stack}\`\`\``);
  }
}

module.exports = CommandErrorListener;