const { Inhibitor } = require('discord-akairo');

class RegisteredInhibitor extends Inhibitor {
	constructor() {
		super('registered', {
			reason: 'user has a character and trying to make a new one'
		});
	}

	exec(message, command) {
		const blockedCommands = ['start'];
		const blockedUsers = this.client.players;
		return blockedCommands.includes(command.id) && blockedUsers.includes(message.author.id);
	}
}

module.exports = RegisteredInhibitor;