const { Command } = require('discord-akairo');

class SetPrefixCommand extends Command {
  constructor() {
    super('setprefix', {
      aliases: ['setprefix', 'sp'],
      channel: 'guild',
      userPermissions: 'MANAGE_GUILD',
      category: 'utility',
      ignorePermissions: ['167988857046827010', '575448221577641989'],
      description: {
        content: 'Add, remove, or reset prefix(es).',
        usage: 'setprefix (--add | --del | --reset) (prefix)',
        example: 'setprefix --add !'
      },
      args: [
        {
          id: 'prefix',
          type: 'string'
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
    if (args.add && !args.del && !args.reset) {
      if (args.prefix.length < 3) {
        try {
          this.client.guildSettings.get(message.guild.id).prefix.push(args.prefix)
          await this.client.db.query(`
            UPDATE
              guildsettings
            SET
              prefix = $1
            WHERE
              guildid = $2`,
            [this.client.guildSettings.get(message.guild.id).prefix, message.guild.id])
          return message.channel.send(`Successfully added ${args.prefix}.`)
        }
        catch (e) {
          message.channel.send('There was an error changing your prefix!  Please report this to my maker, an invite link can be found in the `invite` command.')
          this.client.channels.get('547399254864560138').send(`Error changing prefix on ${message.guild.name}.
            ${e.message}
            ${e.stack}`, {code: 'xxl'})
        }
      }
      else return message.channel.send('Please supply a 1 or 2 letter prefix.')
    }
    else if (!args.add && args.del && !args.reset && args.prefix) {
      if (this.client.guildSettings.get(message.guild.id).prefix.includes(args.prefix)) {
        try {
          const pIndex = this.client.guildSettings.get(message.guild.id).prefix.indexOf(args.prefix)
          this.client.guildSettings.get(message.guild.id).prefix.splice(pIndex, 1)
          await this.client.db.query(`
            UPDATE
              guildsettings
            SET
              prefix = $1
            WHERE
              guildid = $2`,
            [this.client.guildSettings.get(message.guild.id).prefix, message.guild.id])
          return message.channel.send(`Successfully removed ${args.prefix}.`)
        }
        catch (e) {
          message.channel.send('There was an error changing your prefix!  Please report this to my maker, an invite link can be found in the `invite` command.')
            this.client.channels.get('547399254864560138').send(`Error changing prefix on ${message.guild.name}.
            ${e.message}
            ${e.stack}`, {code: 'xxl'})        
        }
      }
      else return message.channel.send('No prefix found.')
    }
    else if (!args.add && !args.del && args.reset) {
      try {
        this.client.guildSettings.get(message.guild.id).prefix = [';'];
        await this.client.db.query(`
          UPDATE
            guildsettings
          SET
            prefix = $1
          WHERE
            guildid = $2`,
          [this.client.guildSettings.get(message.guild.id).prefix, message.guild.id])
        return message.channel.send('Prefix successfully reset to `;`.')
      }
      catch (e) {
        message.channel.send('There was an error changing your prefix!  Please report this to my maker, an invite link can be found in the `invite` command.')
        this.client.channels.get('547399254864560138').send(`Error changing prefix on ${message.guild.name}.
          ${e.message}
          ${e.stack}`, {code: 'xxl'}) 
      }
    }
  }
}

module.exports = SetPrefixCommand;