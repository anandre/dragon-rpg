const { MessageEmbed } = require('discord.js');
const { stripIndents } = require('common-tags');

module.exports = (client) => {

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
    };
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
    };
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
        player.currMP -= ability.mana;
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
        player.currHP += grossDmg;
        if (player.currHP > player.maxhp) player.currHP = player.maxhp;
        player.currMP -= ability.mana;
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
        currHP = $1,
        currMP = $2
      WHERE
        playerid = $3`,
      [Math.floor(player.maxhp/2), Math.floor(player.maxmp/2), message.author.id]);
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
        currHP = $1,
        currMP = $2
      WHERE
        playerid = $3`,
      [Math.floor(player.maxhp/2), Math.floor(player.maxmp/2), message.author.id]);
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

      Rest and recover, ${message.author.username}, and do not fear to try again!`)
    return message.channel.send(embed);
  }

  client.combatEmbed = (combat) => {
    const players = combat.filter(f => f.side === 'player');
    const monsters = combat.filter(f => f.side === 'monster');
    const embed = new MessageEmbed()
      .setTitle(`Combat - Turn ${combat.find(t => t.constructor.name === 'Number')}`)
      .setDescription(players.map(f => `**${f.name}** - ❤ HP: ${f.currHP}/${f.maxHP}  ✨ MP: ${f.currMP}/${f.maxMP} 💥 Abilities: ${f.abilities.map(a => a.name).join(', ')}`).join('\n') + '\n')
    for (const monster of monsters) {
      embed.description += `\n**${monster.name}** (${monster.id}) - ❤ HP: ${monster.currHP}/${monster.maxHP}  ✨ MP: ${monster.currMP}/${monster.maxMP}`
    }
    return embed;
  }

  client.readyCheck = async (message, players) => {
    if (!client.players.some(r => players.has(r)) || client.combat.keyArray().map(a => a.split('-')).flat().some(r => players.has(r))) {
      return message.answer(message.author, 'one or more of the users cannot participate, either they\'re in combat already, or they aren\'t playing.');
    }
    await message.channel.send('All players need to respond with \`ready\` to start combat, or \`cancel\` to stop combat now.');
    let promises = [];
    for (const [id, user] of players) {
      const filter = m => m.author.id === id && ['cancel', 'ready'].includes(m.content.toLowerCase());
      promises.push(message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] }).then(msg => {
        if (msg.first().content.toLowerCase() === 'cancel') return Promise.reject(new Error('Combat has been canceled.'));
      }));
    }
    try {
      await Promise.all(promises);
      if (!client.players.some(r => players.has(r)) || client.combat.keyArray().map(a => a.split('-')).flat().some(r => players.has(r))) {
        return message.answer(message.author, 'one or more of the users cannot participate, either they\'re in combat already, or they aren\'t playing.');
      }
      client.combat.set(players.keyArray().join('-'), []);
      const thisCombat = client.combat.get(players.keyArray().join('-'));
      const playerStats = (await client.db.query(`SELECT
          playerid, path, currhp, currmp, level, weaponid, armorid, accessoryid, xp, gold
        FROM
          players
        WHERE
          playerid IN ('${players.keyArray().join('\', \'')}')`)).rows;
      for (const fighter of playerStats) {
        const path = require(`../data/paths/${fighter.path}.js`);
        const combatant = new path(client, {
          id: fighter.playerid,
          name: (await client.users.fetch(fighter.playerid)).username,
          level: fighter.level,
          xp: fighter.xp,
          gold: fighter.gold,
          weaponid: fighter.weaponid,
          armorid: fighter.armorid,
          accessoryid: fighter.accessoryid,
          currHP: fighter.currhp,
          currMP: fighter.currmp
        });
        combatant.side = 'player';
        thisCombat.push(combatant);

        const eData = client.enemies.filter(e => e.level <= fighter.level).random();
        const enemy = new (require(`../data/enemies/${eData.rarity}/${eData.id}.js`))(client);
        //const enemy = { ...client.enemies.filter(e => e.level <= fighter.level).random() };
        enemy.side = 'monster';
        enemy.currHP = enemy.maxHP;
        enemy.currMP = enemy.maxMP;
        enemy.id = `${enemy.id}${thisCombat.filter(e => e.name === enemy.name && e.side === 'monster').length + 1}`
        thisCombat.push(enemy);
      }
      thisCombat.push(1);
    }
    catch (error) {
      if (error === 'Combat has been canceled.') {
        return message.answer(message.author, 'one or more players is not ready for combat.');
      }
      else {
        message.answer(message.author, 'there was a problem starting combat.  Please report this in my support server, an invite can be found using the `invite` command.');
        console.log(error)
        client.commandHandler.emit('error', (message, error, client.commandHandler.modules.get('startcombat')));
      }
    }
  }

  client.generateInit = (combat) => {
    for (const combatant of combat) {
      combatant.init = Math.floor(Math.random() * 10) + (combatant.path === 'Rogue' ? combatant.agi + 2 : combatant.agi)
    }
    const initSorted = combat.sort((a, b) => b.init - a.init);
    return initSorted;
  };

  client.fighterPrompt = async (thisCombat, message) => {
    let pAttacks = [];
    for (const fighter of thisCombat) {
      if (fighter.side === 'player') {
        if (fighter.currHP > 0) {
          const cFilter = m => {
            const args = m.content.toLowerCase().trim().split(/ +/g);
            //add cast spell-name target format
            return m.author.id === fighter.id
            &&
            (
              (
                ['attack', 'a', 'att'].includes(args[0])
                && thisCombat.map(f => f.id).indexOf(args[1]) !== -1
                )
              ||
              (
                ['cast', 'c', 'use'].includes(args[0])
                && fighter.abilities.some(a => a.name === args[1])
                && fighter.abilities.find(a => a.name === args[1]).cooldown === client.abilities.find(a => a.name === args[1]).cooldown
                && thisCombat.map(f => f.id).indexOf(args[2]) !== -1
              )
            )
          }
          pAttacks.push(message.channel.awaitMessages(cFilter, { max: 1 }))
        }
      }
      else {
        if (fighter.currHP > 0) {
          const players = thisCombat.filter(f => f.side === 'player');
          const targ = players[Math.floor(Math.random() * players.length)].id
          pAttacks.push(Promise.resolve(`${fighter.id} attack ${targ}`));
        }
      }
    }
    const round = await Promise.all(pAttacks);
    console.log(round);
    const roundAttacks = round.map(r => r.constructor.name === 'Collection' ? `${r.first().author.id} ${r.first().content.toLowerCase().trim().split(/ +/g).slice(0, 3).join(' ')}`.split(' ') : r.split(' '));
    //console.log(roundAttacks);
    const res = [];
    for (const choice of roundAttacks) {
      if (['attack', 'a', 'att'].includes(choice[1])) {
        const attacker = thisCombat.find(a => a.id === choice[0]);
        const defender = thisCombat.find(a => a.id === choice[2]);
        const action = client.attack(attacker, defender, attacker.statuses, defender.statuses);
        res.push(action);
      }
      else if (['cast', 'c', 'use'].includes(choice[1])) {

      }
      const attacker = thisCombat.find(a => a.id === choice[0]);
      const defender = thisCombat.find(d => d.id === choice[2]); //fix this line to work attack/cast
      //fix attack to start working with hit/miss/crit rolls in order
      const choiceObj = {
        attack: client.attack(attacker, defender, attacker.statuses, defender.statuses)
      }
      const action = choiceObj[choice[1]];
      res.push(action)
    }
    return res;
  }

  client.attack = (attacker, defender, aStatuses, dStatuses) => {
    if (attacker.currHP === 0) return;

    const toHit = Math.random() * 100;
    const critChance = attacker.prec;
    const toMiss = 100 + attacker.acc - defender.dodge;
    //const critChance = (10 + (attacker.agi * 1.25)) * (Object.keys(aStatuses).includes('focus') ? 1.1 : 1);
    //const toMiss = 100 - ((5 + (defender.agi * 1.10)) + (Object.keys(aStatuses).includes('aim') ? 15 : 0) + (Object.keys(dStatuses).includes('evasion') ? 25 : 0));
    //console.log(`toHit: ${toHit}. toMiss: ${toMiss}. miss: ${toHit > toMiss}`)
    if (toHit > toMiss) {
      return `${attacker.name} attacked ${defender.name} but missed.`;
    }
    //console.log(`critChance: ${critChance}`)
    let crit = false;
    if (toHit <= critChance) {
      crit = true;
    }
    const critMulti = 1.5 * (1 + attacker.agi/25)
    //console.log(crit)
    const weapon = attacker.weapon;
    const defense = {
      physical: defender.tough,
      piercePhysical: Math.floor(defender.tough/2),
      magical: defender.mind,
      pierceMagical: Math.floor(defender.mind/2),
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
    }
    const statusMulti = aStatuses.filter(s => Object.keys(statusMods).includes(s.name)).map(s => statusMods[s]).reduce((a, b) => a * b, 1);
    //need to add defensive statuses check - separate for phys and mag
    //console.log(`statusMulti: ${statusMulti}`)
    const baseDmg = Math.floor((Number.parseFloat((Math.random() * 1.5).toFixed(2)) + 1) * weapon.attack) + 1 + Math.max(Math.floor(damagetype[weapon.attackstat]/3),1);
    //console.log(`baseDmg: ${baseDmg}`)
    const rawDmg = (baseDmg * statusMulti) * (crit ? critMulti : 1).toFixed();
    //console.log(`rawDmg: ${rawDmg}`)
    const netDmg = Math.max(Math.round(rawDmg - defense[weapon.attacktype]), 1);
    //console.log(`netDmg ${netDmg}`)
    defender.currHP = Math.max(defender.currHP - netDmg, 0);
    return `${attacker.name} attacked ${defender.name} and did ${netDmg} damage.`;
  }

  client.spellCast = (attacker, ability, defender, aStatuses, dStatuses) => {
    if (attacker.currHP === 0) return;
    defender.currMP = Math.max(defender.currMP - ability.mana, 0);
    const defense = {
      physical: defender.physdef,
      piercePhysical: Math.floor(defender.physef/2),
      magical: defender.magdef,
      pierceMagical: Math.floor(defender.magdef/2),
      pierceAll: 0
    };
    const damagetype = {
      strength: attacker.str,
      agility: attacker.agi,
      magic: attacker.mag,
      spirit: attacker.spr
    }
    //may be a single line if no other statuses to boost mag dmg
    const attackStatuses = {
      boost: 1.5,
      enheal: 1.5
    }
    const defenseStatuses = {
      shell: 1.5
    }
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
    ]
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
    ]
    //mana cost, etc
    if (ability.type === 'buff') {
      if (Object.keys(dStatuses).includes(ability.name)) {
        return `${attacker.name} gave ${defender.name} ${ability.name} but they already had it.`;
      }
      else {
        const buff = client.statuses.get(ability.name);
        dStatuses.push({
          name: buff.name,
          duration: buff.duration
        })
      }
    }
    const statusMulti = aStatuses.filter(s => Object.keys(attackStatuses).includes(s.name)).map(s => attackStatuses[s]).reduce((a, b) => a * b, 1);
    if (ability.element) {
      const ele = elementalBoosts.find(e => e.element === ability.element);
      statusMulti *= aStatuses.filter(s => Object.keys(ele).includes(s.name)).map(s => ele[s]).reduce((a, b) => a * b, 1);
    }
    const baseDmg = Math.floor((Number.parseFloat((Math.random() * 2.5).toFixed(2)) + 1) * ability.damage) + 1 + Math.max(Math.floor(damagetype[ability.attackstat]/3),1);
    const rawDmg = (baseDmg * statusMulti).toFixed();
    if (ability.type === 'heal') {
      defender.currHP = Math.min(defender.currHP += rawDmg, defender.maxhp);
      return `${attacker.name} healed ${defender.name} for ${rawDmg} HP.`;
    }
  }

  client.newTurn = async (combat) => {
    const players = combat.filter(f => f.side === 'player');
    const enemies = combat.filter(f => f.side === 'monster');
  }
}