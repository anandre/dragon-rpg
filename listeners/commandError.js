const { Listener } = require('discord-akairo');
const { stripIndents} = require('common-tags');

class CommandErrorListener extends Listener {
  constructor() {
    super('commandError', {
      emitter: 'commandHandler',
      event: 'error'
    })
  }

  async exec(error, message, command) {
    return message.channel.send(stripIndents`There was an error running ${command.id}. \`\`\`xl
      ${error.message}
      ${error.stack}\`\`\``);
  }
}

module.exports = CommandErrorListener;