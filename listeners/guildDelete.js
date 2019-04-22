const { Listener } = require('discord-akairo');
const { MessageEmbed } = require('discord.js');

class GuildDeleteListener extends Listener{
    constructor() {
        super('guildDelete', {
            emitter: 'client',
            event: 'guildDelete'
        });
    }

    async exec(guild) {
        this.client.guildSettings.delete(guild.id);
        await this.client.db.query('DELETE FROM guildsettings WHERE guildid = $1', [guild.id]);
        const embed = new MessageEmbed()
            .setColor('RED')
            .setTitle(`Left ${guild.name} (id: ${guild.id}) at ${new Date().toLocaleString()}`)
        return this.client.channels.get('550762593443250186').send(embed);
    }
}

module.exports = GuildDeleteListener;