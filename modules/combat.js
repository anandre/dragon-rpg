const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = (client) => {

  client.generateInit = (player, enemy) => {
    const playerInit = Math.floor(Math.random() * 10) + (player.path === 'Rogue' ? player.agi : player.agi + 2);
    const enemyInit = Math.floor(Math.random() * 10) + enemy.agi;

    return {
      playerInit: playerInit,
      enemyInit: enemyInit
    };
  };

  client.incrementTurn = async (player, enemy, message, playerDmg, enemyDmg) => {
    player.turn++;
    for (let i = 0; i < player.cooldowns.length; i++) {
      if (player.cooldowns[i] !== client.abilities.get(player.abilities[i]).cooldown) {
        player.cooldowns[i]--;
      };
      if (player.cooldowns[i] < 0) {
        player.cooldowns[i] = client.abilities.get(player.abilities[i].cooldown)
      };
    };
    for (let k = 0; k < player.enemycd.length; k++) {
      if (player.enemycd[k] !== client.abilities.get(enemy.abilities[k]).cooldown) {
        player.enemycd[k]--;
      };
      if (player.enemycd[k] < 0) {
        player.enemycd[k] = client.abilities.get(enemy.abilties[k].cooldown)
      };
    };
    if (player.turn % 3 === 0) {
      await client.db.query(`
        UPDATE
          combat
        SET
          currhp = $1,
          currmp = $2,
          enemyhp = $3,
          enemymp = $4,
          turn = $5,
          cooldowns = $6,
          enemycd = $7
        WHERE
          playerid = $8`,
        [player.currhp, player.currmp, player.enemyhp, player.enemymp, player.turn,
        player.cooldowns, player.enemycd, player.playerid]);
    };
    const embed = new MessageEmbed()
      .setColor('BLUE')
      .setTitle(`${message.author.username}'s combat against ${enemy.name}!`)
      .setDescription(stripIndents`${message.author.username} has dealt ${playerDmg ? playerDmg : 0} damage!
        ${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)} has done ${enemyDmg ? enemyDmg : 0} damage!`)
      .addField(stripIndents`**${message.author.username}**`, `❤ HP: ${player.currhp}/${player.maxhp}
      ✨ MP: ${player.currmp}/${player.maxmp}
      💥 Abilities: ${player.abilities.join(', ')}`, true)
      .addField(stripIndents`**${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)}**`, `❤ HP: ${player.enemyhp}
      ✨ MP: ${player.enemymp}`, true)
      .setFooter(`Current turn: ${player.turn}`)
    return message.channel.send(embed);
  };

  client.fleeIncrementTurn = async (player, enemy, message, enemyDmg) => {
    player.turn++;
    for (let i = 0; i < player.cooldowns.length; i++) {
      if (player.cooldowns[i] !== client.abilities.get(player.abilities[i]).cooldown) {
        player.cooldowns[i]--;
      };
      if (player.cooldowns[i] < 0) {
        player.cooldowns[i] = client.abilities.get(player.abilities[i].cooldown)
      };
    };
    for (let k = 0; k < player.enemycd.length; k++) {
      if (player.enemycd[k] !== client.abilities.get(enemy.abilities[k]).cooldown) {
        player.enemycd[k]--;
      };
      if (player.enemycd[k] < 0) {
        player.enemycd[k] = client.abilities.get(enemy.abilties[k].cooldown)
      };
    };
    if (player.turn % 3 === 0) {
      await client.db.query(`
        UPDATE
          combat
        SET
          currhp = $1,
          currmp = $2,
          enemyhp = $3,
          enemymp = $4,
          turn = $5,
          cooldowns = $6,
          enemycd = $7
        WHERE
          playerid = $8`,
        [player.currhp, player.currmp, player.enemyhp, player.enemymp, player.turn,
        player.cooldowns, player.enemycd, player.playerid]);
    };
    const embed = new MessageEmbed()
      .setColor('BLUE')
      .setTitle(`${message.author.username}'s combat against ${enemy.name}!`)
      .setDescription(stripIndents`${message.author.username} tried to run but failed!
        ${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)} has done ${enemyDmg ? enemyDmg : 0} damage!`)
      .addField(stripIndents`**${message.author.username}**`, `❤ HP: ${player.currhp}/${player.maxhp}
      ✨ MP: ${player.currmp}/${player.maxmp}
      💥 Abilities: ${player.abilities.join(', ')}`, true)
      .addField(stripIndents`**${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)}**`, `❤ HP: ${player.enemyhp}
      ✨ MP: ${player.enemymp}`, true)
      .setFooter(`Current turn: ${player.turn}`)
    return message.channel.send(embed);
  };

  client.playerBasicAttack = (player, weapon, enemy) => {
    const playerDmgDice = weapon.weapondice.split(' + ')[0].split('d');
    const playerDmgAdd = weapon.weapondice.split(' + ')[1].split(' * ');

    const playerObject = {
      n: 0,
      p: enemy.physdef,
      m: enemy.magdef,
      STR: player.str,
      AGI: player.agi,
      MAG: player.mag,
      SPR: player.spr
    };

    let rawDmg = 0;
    let i = 0;
    while (i < parseInt(playerDmgDice[0])) {
      i++;
      rawDmg += Math.floor(Math.random() * parseInt(playerDmgDice[1]) + 1);
    };
    const addDmg = Math.floor(parseFloat(playerDmgAdd[0]) * playerObject[playerDmgAdd[1]]);
    const playerRawDmg = rawDmg + addDmg;
    const playerNetDmg = playerRawDmg - playerObject[weapon.damagetype];
    player.enemyhp -= Math.max(1, playerNetDmg);
    return Math.max(1, playerNetDmg);
  };

    client.playerCastSingleDamage = (player, enemy, ability) => {
        const dmgDice = ability.damage.split(' + ')[0].split('d');
        const dmgAdd = ability.damage.split(' + ')[1].split(' * ');
        const type = {
            n: 0,
            p: enemy.physdef,
            m: enemy.magdef,
            STR: player.str,
            AGI: player.agi,
            MAG: player.mag,
            SPR: player.spr
        };

        let rawDmg = 0;
        let i = 0;
        while (i < parseInt(dmgDice[0])) {
            i++;
            rawDmg += Math.floor(Math.random() * parseInt(dmgDice[1]) + 1);
        };
        const addDmg = Math.floor(parseFloat(dmgAdd[0]) * type[dmgAdd[1]]);
        const grossDmg = rawDmg + addDmg;
        const netDmg = grossDmg - type[ability.damagetype];
        player.enemyhp -= Math.max(1, netDmg);
        player.currmp -= ability.mana;
        player.cooldowns[player.abilities.indexOf(ability.name)] -= 1;
        return Math.max(1, netDmg);
    };

    client.playerCastSingleHeal = (player, ability) => {
        console.log(`${ability}`);
        const dmgDice = ability.damage.split(' + ')[0];
        const dmgAdd = ability.damage.split(' + ')[1];

        const type = {
            STR: player.str,
            AGI: player.agi,
            MAG: player.mag,
            SPR: player.spr
        };

        let rawDmg = 0;
        let i = 0;
        while (i < parseInt(dmgDice[0])) {
            i++;
            rawDmg += Math.floor(Math.random() * parseInt(dmgDice[1]));
        };
        const addDmg = Math.floor(parseFloat(dmgAdd[0]) * type[dmgAdd[1]]);
        const grossDmg = rawDmg + addDmg;
        player.currhp += grossDmg;
        if (player.currhp > player.maxhp) player.currhp = player.maxhp;
        player.currmp -= ability.mana;
        player.cooldowns[player.abilities.indexOf(ability.name)] -= 1;
        return grossDmg;
    };

    client.flee = (player, enemy) => {
        const success = Math.random() * (player.agi * 1.5) - (enemy.agi * .75) + 25;
        const roll = Math.random() * 100;
        if (roll < success) {
            return true;
        }
        return false;
    }
  
  client.playerWin = async (player, enemy, message, playerDmg, enemyDmg) => {
    if (typeof playerDmg === undefined) enemyDmg = 0;
    if (typeof enemyDmg === undefined ) enemyDmg = 0;
    await client.db.query(`
      UPDATE
        players
      SET
        currhp = LEAST(maxhp, $1),
        currmp = LEAST(maxmp, $2),
        xp = (xp + $3),
        gold = (gold + $4)
      WHERE
        playerid = $5`,
      [player.currhp, player.currmp, enemy.xp, enemy.gold, message.author.id]);
    await client.db.query(`
      DELETE FROM
        combat
      WHERE
        playerid = $1`,
      [message.author.id]);
    client.combat.delete(message.author.id);
    const embed = new MessageEmbed()
      .setColor('GREEN')
      .setTitle(`${message.author.username}'s combat against ${enemy.name}!`)
      .setDescription(stripIndents`${message.author.username} has dealt ${playerDmg ? playerDmg : 0} damage!
        ${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)} has done ${enemyDmg ? enemyDmg : 0} damage!`)
      .addField(`${message.author.username} has defeated ${enemy.name}!`, `They have found ${enemy.gold} gold and earned ${enemy.xp} experience!`)
      .addField(stripIndents`**${message.author.username}**`, `❤ HP: ${player.currhp}/${player.maxhp}
      ✨ MP: ${player.currmp}/${player.maxmp}
      💥 Abilities: ${player.abilities.join(', ')}`, true)
      .addField(stripIndents`**${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)}**`, `❤ HP: ${player.enemyhp}
      ✨ MP: ${player.enemymp}`, true)
    message.channel.send(embed);
    //await client.checkXP(message);
  };

  client.playerDefeat = async (player, enemy, message, playerDmg, enemyDmg) => {
    if (typeof playerDmg === undefined) enemyDmg = 0;
    if (typeof enemyDmg === undefined ) enemyDmg = 0;
    await client.db.query(`
      DELETE FROM
        combat
      WHERE
        playerid = $1`,
      [message.author.id]);
    await client.db.query(`
      UPDATE
        players
      SET
        currhp = $1,
        currmp = $2
      WHERE
        playerid = $3`,
      [Math.floor(player.maxhp/2), Math.floor(player.maxmp/2), message.author.id]);
    client.combat.delete(message.author.id);
    const embed = new MessageEmbed()
      .setColor('RED')
      .setTitle(`${message.author.username}'s combat against ${enemy.name}!`)
      .setDescription(stripIndents`${message.author.username} has dealt ${playerDmg ? playerDmg : 0} damage!
        ${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)} has done ${enemyDmg ? enemyDmg : 0} damage!`)
      .addField(stripIndents`**${message.author.username}**`, `❤ HP: ${player.currhp}/${player.maxhp}
      ✨ MP: ${player.currmp}/${player.maxmp}
      💥 Abilities: ${player.abilities.join(', ')}`, true)
      .addField('\u200b', stripIndents`${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)} has defeated ${message.author.username}!

      Rest and recover, ${message.author.username}, and do not fear to try again!`)
    return await message.channel.send(embed);
  }

  client.fleePlayerDefeat = async (player, enemy, message, enemyDmg) => {
    await client.db.query(`
      DELETE FROM
        combat
      WHERE
        playerid = $1`,
      [message.author.id]);
    await client.db.query(`
      UPDATE
        players
      SET
        currhp = $1,
        currmp = $2
      WHERE
        playerid = $3`,
      [Math.floor(player.maxhp/2), Math.floor(player.maxmp/2), message.author.id]);
    client.combat.delete(message.author.id);
    const embed = new MessageEmbed()
      .setColor('RED')
      .setTitle(`${message.author.username}'s combat against ${enemy.name}!`)
      .setDescription(stripIndents`${message.author.username} could not escape!!
        ${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)} has done ${enemyDmg ? enemyDmg : 0} damage!`)
      .addField(stripIndents`**${message.author.username}**`, `❤ HP: ${player.currhp}/${player.maxhp}
      ✨ MP: ${player.currmp}/${player.maxmp}
      💥 Abilities: ${player.abilities.join(', ')}`, true)
      .addField('\u200b', stripIndents`${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)} has defeated ${message.author.username}!

      Rest and recover, ${message.author.username}, and do not fear to try again!`)
    return message.channel.send(embed);
  }
}