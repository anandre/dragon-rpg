const { Command } = require('discord-akairo');

class PingCommand extends Command {
  constructor() {
    super('ping', {
      aliases: ['ping'],
      category: 'utility',
      description: {
        content: 'Basic ping command, make sure I\'m alive.',
        usage: 'ping',
        example: 'ping'
      }
    });
  }

  async exec(message) {
    const m = await message.channel.send('Pinging...');
    return m.edit(`Latency is ${m.createdTimestamp - message.createdTimestamp} ms, ping is ${Math.round(message.client.ws.ping)} ms.`);
  }
}

module.exports = PingCommand;