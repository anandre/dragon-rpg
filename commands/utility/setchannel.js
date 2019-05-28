const { Command } = require('discord-akairo');
const { stripIndents } = require('common-tags');

class SetChannelCommand extends Command { 
  constructor() {
    super('setchannel', {
      aliases: ['setchannel', 'setch'],
      userPermissions: 'MANAGE_GUILD',
      channel: 'guild',
      category: 'utility',
      ignorePermissions: ['167988857046827010', '575448221577641989'],
      description: {
        content: 'Set which channel(s) I will respond in.  This does not apply to `help`, `channels` or `setchannels` command.',
        usage: 'setchannel (--add | --del | --reset) (#channel | channel ID)',
        example: stripIndents`setchannel --add #rpg
          setchannel --del #rpg
          setchannel --reset`
      },
      args: [
        {
          id: 'channel',
          type: 'channel'
        },
        {
          id: 'add',
          match: 'flag',
          flag: '--add'
        },
        {
          id: 'del',
          match: 'flag',
          flag: '--del'
        },
        {
          id: 'reset',
          match: 'flag',
          flag: '--reset'
        }
      ]
    })
  }
    
  async exec(message, args) {
    if (args.add && !args.del && !args.reset && args.channel) {
      try {
        this.client.guildSettings.get(message.guild.id).channel.push(args.channel.id);
        await this.client.db.query(`
          UPDATE
            guildsettings
          SET
            channel = $1
          WHERE
            guildid = $2`,
          [this.client.guildSettings.get(message.guild.id).channel, message.guild.id]);
        return message.channel.send(`Successfully added <#${args.channel.id}> to allowed channels.`)
      }
      catch (e) {
        message.channel.send('There was an error changing your allowed channels!  Please report this to my maker, an invite link can be found in the `invite` command.')
        this.client.channels.get('547399254864560138').send(`Error changing channel on ${message.guild.name}.
        ${e.message}
        ${e.stack}`, {code: 'xxl'})
      }
    }
    else if (!args.add && args.del && !args.reset && args.channel) {
      try {
        const cIndex = this.client.guildSettings.get(message.guild.id).channel.indexOf(args.channel.id);
        this.client.guildSettings.get(message.guild.id).channel.splice(cIndex, 1);
        await this.client.db.query(`
          UPDATE
            guildsettings
          SET
            channel = $1
          WHERE
            guildid = $2`,
        [this.client.guildSettings.get(message.guild.id).channel, message.guild.id]);
        return message.channel.send(`Successfully removed <#${args.channel.id}> from allowed channels.`);
      }
      catch (e) {
        message.channel.send('There was an error changing your allowed channels!  Please report this to my maker, an invite link can be found in the `invite` command.')
        this.client.channels.get('547399254864560138').send(`Error changing channel on ${message.guild.name}.
        ${e.message}
        ${e.stack}`, {code: 'xxl'})
      }
    }
    else if (!args.add && !args.del && args.reset) {
      try {
        this.client.guildSettings.get(message.guild.id).channel = [];
        await this.client.db.query(`
          UPDATE
            guildsettings
          SET
            channel = $1
          WHERE
            guildid = $2`,
          [this.client.guildSettings.get(message.guild.id).channel, message.guild.id]);
        return message.channel.send('Reset channels to respond in any channel.')
      }
      catch (e) {
        message.channel.send('There was an error changing your allowed channels!  Please report this to my maker, an invite link can be found in the `invite` command.')
        this.client.channels.get('547399254864560138').send(`Error changing channel on ${message.guild.name}.
        ${e.message}
        ${e.stack}`, {code: 'xxl'})
      }
    }
  }
}

module.exports = SetChannelCommand;