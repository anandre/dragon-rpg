const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = (client) => {

  client.incrementTurn = async (player, enemy, message, playerDmg, enemyDmg) => {
    player.turn++;
    for (let i = 0; i < player.cooldowns.length; i++) {
      if (player.cooldowns[i] !== client.abilities.get(player.abilities[i]).cooldown) {
        player.cooldowns[i]--;
      }
      if (player.cooldowns[i] < 0) {
        player.cooldowns[i] = client.abilities.get(player.abilities[i].cooldown);
      }
    }
    for (let k = 0; k < player.enemycd.length; k++) {
      if (player.enemycd[k] !== client.abilities.get(enemy.abilities[k]).cooldown) {
        player.enemycd[k]--;
      }
      if (player.enemycd[k] < 0) {
        player.enemycd[k] = client.abilities.get(enemy.abilties[k].cooldown);
      }
    }
    if (player.turn % 3 === 0) {
      await client.db.query(`
        UPDATE
          combat
        SET
          currHP = $1,
          currMP = $2,
          enemyhp = $3,
          enemymp = $4,
          turn = $5,
          cooldowns = $6,
          enemycd = $7
        WHERE
          playerid = $8`,
      [player.currHP, player.currMP, player.enemyhp, player.enemymp, player.turn,
        player.cooldowns, player.enemycd, player.playerid]);
    }
    const embed = new MessageEmbed()
      .setColor('BLUE')
      .setTitle(`${message.author.username}'s combat against ${enemy.name}!`)
      .setDescription(stripIndents`${message.author.username} has dealt ${playerDmg ? playerDmg : 0} damage!
        ${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)} has done ${enemyDmg ? enemyDmg : 0} damage!`)
      .addField(stripIndents`**${message.author.username}**`, `❤ HP: ${player.currHP}/${player.maxhp}
      ✨ MP: ${player.currMP}/${player.maxmp}
      💥 Abilities: ${player.abilities.join(', ')}`, true)
      .addField(stripIndents`**${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)}**`, `❤ HP: ${player.enemyhp}
      ✨ MP: ${player.enemymp}`, true)
      .setFooter(`Current turn: ${player.turn}`);
    return message.channel.send(embed);
  };

  client.fleeIncrementTurn = async (player, enemy, message, enemyDmg) => {
    player.turn++;
    for (let i = 0; i < player.cooldowns.length; i++) {
      if (player.cooldowns[i] !== client.abilities.get(player.abilities[i]).cooldown) {
        player.cooldowns[i]--;
      }
      if (player.cooldowns[i] < 0) {
        player.cooldowns[i] = client.abilities.get(player.abilities[i].cooldown);
      }
    }
    for (let k = 0; k < player.enemycd.length; k++) {
      if (player.enemycd[k] !== client.abilities.get(enemy.abilities[k]).cooldown) {
        player.enemycd[k]--;
      }
      if (player.enemycd[k] < 0) {
        player.enemycd[k] = client.abilities.get(enemy.abilties[k].cooldown);
      }
    }
    if (player.turn % 3 === 0) {
      await client.db.query(`
        UPDATE
          combat
        SET
          currHP = $1,
          currMP = $2,
          enemyhp = $3,
          enemymp = $4,
          turn = $5,
          cooldowns = $6,
          enemycd = $7
        WHERE
          playerid = $8`,
      [player.currHP, player.currMP, player.enemyhp, player.enemymp, player.turn,
        player.cooldowns, player.enemycd, player.playerid]);
    }
    const embed = new MessageEmbed()
      .setColor('BLUE')
      .setTitle(`${message.author.username}'s combat against ${enemy.name}!`)
      .setDescription(stripIndents`${message.author.username} tried to run but failed!
        ${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)} has done ${enemyDmg ? enemyDmg : 0} damage!`)
      .addField(stripIndents`**${message.author.username}**`, `❤ HP: ${player.currHP}/${player.maxhp}
      ✨ MP: ${player.currMP}/${player.maxmp}
      💥 Abilities: ${player.abilities.join(', ')}`, true)
      .addField(stripIndents`**${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)}**`, `❤ HP: ${player.enemyhp}
      ✨ MP: ${player.enemymp}`, true)
      .setFooter(`Current turn: ${player.turn}`);
    return message.channel.send(embed);
  };

  client.flee = (player, enemy) => {
    const success = Math.random() * (player.agi * 1.5) - (enemy.agi * 0.75) + 25;
    const roll = Math.random() * 100;
    if (roll < success) {
      return true;
    }
    return false;
  };

  client.playerWin = async (player, enemy, message, playerDmg, enemyDmg) => {
    if (typeof playerDmg === undefined) enemyDmg = 0;
    if (typeof enemyDmg === undefined) enemyDmg = 0;
    await client.db.query(`
      UPDATE
        players
      SET
        currHP = LEAST(maxhp, $1),
        currMP = LEAST(maxmp, $2),
        xp = (xp + $3),
        gold = (gold + $4)
      WHERE
        playerid = $5`,
    [player.currHP, player.currMP, enemy.xp, enemy.gold, message.author.id]);
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
      .addField(stripIndents`**${message.author.username}**`, `❤ HP: ${player.currHP}/${player.maxhp}
      ✨ MP: ${player.currMP}/${player.maxmp}
      💥 Abilities: ${player.abilities.join(', ')}`, true)
      .addField(stripIndents`**${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)}**`, `❤ HP: ${player.enemyhp}
      ✨ MP: ${player.enemymp}`, true);
    message.channel.send(embed);
    // await client.checkXP(message);
  };

  client.playerDefeat = async (player, enemy, message, playerDmg, enemyDmg) => {
    if (typeof playerDmg === undefined) enemyDmg = 0;
    if (typeof enemyDmg === undefined) enemyDmg = 0;
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
        currHP = $1,
        currMP = $2
      WHERE
        playerid = $3`,
    [Math.floor(player.maxhp * 0.5), Math.floor(player.maxmp * 0.5), message.author.id]);
    client.combat.delete(message.author.id);
    const embed = new MessageEmbed()
      .setColor('RED')
      .setTitle(`${message.author.username}'s combat against ${enemy.name}!`)
      .setDescription(stripIndents`${message.author.username} has dealt ${playerDmg ? playerDmg : 0} damage!
        ${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)} has done ${enemyDmg ? enemyDmg : 0} damage!`)
      .addField(stripIndents`**${message.author.username}**`, `❤ HP: ${player.currHP}/${player.maxhp}
      ✨ MP: ${player.currMP}/${player.maxmp}
      💥 Abilities: ${player.abilities.join(', ')}`, true)
      .addField('\u200b', stripIndents`${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)} has defeated ${message.author.username}!

      Rest and recover, ${message.author.username}, and do not fear to try again!`);
    return await message.channel.send(embed);
  };

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
        currHP = $1,
        currMP = $2
      WHERE
        playerid = $3`,
    [Math.floor(player.maxhp * 0.5), Math.floor(player.maxmp * 0.5), message.author.id]);
    client.combat.delete(message.author.id);
    const embed = new MessageEmbed()
      .setColor('RED')
      .setTitle(`${message.author.username}'s combat against ${enemy.name}!`)
      .setDescription(stripIndents`${message.author.username} could not escape!!
        ${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)} has done ${enemyDmg ? enemyDmg : 0} damage!`)
      .addField(stripIndents`**${message.author.username}**`, `❤ HP: ${player.currHP}/${player.maxhp}
      ✨ MP: ${player.currMP}/${player.maxmp}
      💥 Abilities: ${player.abilities.join(', ')}`, true)
      .addField('\u200b', stripIndents`${enemy.name.charAt(0).toUpperCase()}${enemy.name.substr(1)} has defeated ${message.author.username}!

      Rest and recover, ${message.author.username}, and do not fear to try again!`);
    return message.channel.send(embed);
  };

  client.attack = (attacker, defender, aStatuses, dStatuses) => {
    if (attacker.currHP === 0) return;

    const toHit = Math.random() * 100;
    const critChance = attacker.prec;
    const toMiss = 100 + attacker.acc - defender.dodge;
    // const critChance = (10 + (attacker.agi * 1.25)) * (Object.keys(aStatuses).includes('focus') ? 1.1 : 1);
    // const toMiss = 100 - ((5 + (defender.agi * 1.10)) + (Object.keys(aStatuses).includes('aim') ? 15 : 0) + (Object.keys(dStatuses).includes('evasion') ? 25 : 0));
    // console.log(`toHit: ${toHit}. toMiss: ${toMiss}. miss: ${toHit > toMiss}`)
    if (toHit > toMiss) {
      return `${attacker.name} attacked ${defender.name} but missed.`;
    }
    // console.log(`critChance: ${critChance}`)
    let crit = false;
    if (toHit <= critChance) {
      crit = true;
    }
    // console.log(crit)
    const weapon = attacker.weapon;
    const defense = {
      physical: defender.tough,
      piercePhysical: Math.floor(defender.tough * 0.5),
      magical: defender.mind,
      pierceMagical: Math.floor(defender.mind * 0.5),
      pierceAll: 0
    };
    const statusMods = {
      berserk: 1.5,
      weak: 0.5
    };
    const defenseMods = {
      shell: 1.5,
      protect: 1.5

    };
    const damagetype = {
      strength: attacker.str,
      agility: attacker.agi,
      magic: attacker.mag,
      spirit: attacker.spr
    };
    const statusMulti = aStatuses.filter(s => Object.keys(statusMods).includes(s.name)).map(s => statusMods[s]).reduce((a, b) => a * b, 1);
    // need to add defensive statuses check - separate for phys and mag
    // console.log(`statusMulti: ${statusMulti}`)
    const baseDmg = Math.floor((Number.parseFloat((Math.random() * 1.5).toFixed(2)) + 1) * weapon.attack) + 1 + Math.max(Math.floor(damagetype[weapon.attackstat] * 0.33), 1);
    // console.log(`baseDmg: ${baseDmg}`)
    const rawDmg = (baseDmg * statusMulti) * (crit ? attacker.fero : 1).toFixed();
    // console.log(`rawDmg: ${rawDmg}`)
    const netDmg = Math.max(Math.round(rawDmg - defense[weapon.attacktype]), 1);
    // console.log(`netDmg ${netDmg}`)
    defender.currHP = Math.max(defender.currHP - netDmg, 0);
    return `${attacker.name} attacked ${defender.name} and did ${netDmg} damage.`;
  };


  client.cast = (attacker, defender, ability, aStatuses, dStatuses) => {
    if (attacker.currHP === 0) return;
    defender.currMP = Math.max(defender.currMP - ability.mana, 0);
    const defense = {
      physical: defender.physdef,
      piercePhysical: Math.floor(defender.physef * 0.5),
      magical: defender.magdef,
      pierceMagical: Math.floor(defender.magdef * 0.5),
      pierceAll: 0
    };
    const damagetype = {
      strength: attacker.str,
      agility: attacker.agi,
      magic: attacker.mag,
      spirit: attacker.spr
    };
    // may be a single line if no other statuses to boost mag dmg
    const attackStatuses = {
      boost: 1.5,
      enheal: 1.5
    };
    const defenseStatuses = {
      shell: 1.5
    };
    const elementalBoosts = [
      {
        element: 'fire',
        enfire: 1.5,
        matifire: 2
      },
      {
        element: 'lightning',
        enspark: 1.5,
        matispark: 2
      }
    ];
    const elementalDefenses = [
      {
        element: 'fire',
        barfire: 1.5,
        anifire: 1.75
      },
      {
        element: 'lightning',
        barspark: 1.5,
        anispark: 1.75
      }
    ];
    // mana cost, etc
    if (ability.type === 'buff') {
      if (Object.keys(dStatuses).includes(ability.name)) {
        return `${attacker.name} gave ${defender.name} ${ability.name} but they already had it.`;
      }
      else {
        const buff = client.statuses.get(ability.name);
        dStatuses.push({
          name: buff.name,
          duration: buff.duration
        });
      }
    }
    let statusMulti = aStatuses.filter(s => Object.keys(attackStatuses).includes(s.name)).map(s => attackStatuses[s]).reduce((a, b) => a * b, 1);
    if (ability.element) {
      const ele = elementalBoosts.find(e => e.element === ability.element);
      statusMulti *= aStatuses.filter(s => Object.keys(ele).includes(s.name)).map(s => ele[s]).reduce((a, b) => a * b, 1);
    }
    const baseDmg = Math.floor((Number.parseFloat((Math.random() * 2.5).toFixed(2)) + 1) * ability.damage) + 1 + Math.max(Math.floor(damagetype[ability.attackstat] * 0.33), 1);
    const rawDmg = (baseDmg * statusMulti).toFixed();
    if (ability.type === 'heal') {
      defender.currHP = Math.min(defender.currHP += rawDmg, defender.maxhp);
      return `${attacker.name} healed ${defender.name} for ${rawDmg} HP.`;
    }
  };

  client.newTurn = async (combat) => {
    const players = combat.filter(f => f.side === 'player');
    const enemies = combat.filter(f => f.side === 'monster');
  };
};