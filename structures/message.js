const { Structures } = require('discord.js');

Structures.extend('Message', Message => {
	class MessageAnswer extends Message {
		answer(user, content) {
			return this.channel.send(`${user.username}, ${content}`);
		}
	}
	return MessageAnswer;
});