const { Command } = require('discord-akairo');
const { join, dirname } = require('path');
const appDir = dirname(require.main.filename);
const dataManager = require(join(appDir, '/data/manager/dataManager.js'));

class EvalCommand extends Command {
  constructor() {
    super('eval', {
      aliases: ['eval', 'ev', 'e'],
      ownerOnly: true,
      category: 'owner',
      args: [
        {
          id: 'code',
          match: 'content'
        }
      ]
    });
  }

  async exec(message, args) {
    try {
      const evaled = eval(args.code);
      const clean = await dataManager.functions.clean(this.client, evaled);
      await message.channel.send(clean, { code: 'xl' });
    }
    catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${await dataManager.functions.clean(this.client, err.message.substr(0, 1900))}\n\`\`\``);
    }
  }
}

module.exports = EvalCommand;