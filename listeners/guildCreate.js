const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class GuildCreateListener extends Listener{
    constructor() {
        super('guildCreate', {
            emitter: 'client',
            event: 'guildCreate'
        });
    }

    async exec(guild) {
        try {
            await this.client.db.query(`INSERT INTO guildsettings (guildid, prefix, channel) VALUES ('${guild.id}', '{";"}', '{}')`);
            this.client.guildSettings.set(guild.id, { id: guild.id, prefix: [';'], channel: [] });
            const embed = new MessageEmbed()
            .setColor('GREEN')
            .setTitle(`Joined ${guild.name} (id: ${guild.id}) at ${new Date().toLocaleString()}`)
            this.client.channels.get('550762593443250186').send(embed);
        }
        catch (e) {
            this.client.channels.get('547399254864560138').send(`Error on joining ${guild.name}.
            ${e.message}
            ${e.stack}`, {code: 'xxl'})
        }
    }
}

module.exports = GuildCreateListener;