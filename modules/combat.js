module.exports = (client) => {

    client.turnIncrement = async (player, enemy) => {
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
            const update = client.combat.get(message.author.id);
            await client.db.query('UPDATE combat SET currhp = $1, currmp = $2, enemyhp = $3, enemymp = $4, turn = $5, cooldowns = $6, enemycd = $7 WHERE playerid = $6', [update.currhp, update.currmp, update.enemyhp, update.enemymp, update.turn, update.playerid])
        };
    };

    client.playerBasicAttack = async (player, weapon, enemy) => {
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
        const addDmg = parseInt(playerDmgAdd[0]) * playerObject[playerDmgAdd[1]];
        const playerRawDmg = rawDmg + addDmg;
        const playerNetDmg = playerRawDmg - playerObject[weapon.damagetype];
        player.enemyhp -= Math.max(1, playerNetDmg);
        return Math.max(1, playerNetDmg);
    };

    client.enemyBasicAttack = async (enemy, player) => {
        const enemyDmgDice = enemy.damage.split(' + ')[0].split('d');
        const enemyDmgAdd = enemy.damage.split( ' + ')[1].split(' * ');

        const enemyObject = {
            n: 0,
            p: player.physdef,
            m: player.magdef,
            STR: enemy.str,
            AGI: enemy.agi,
            MAG: enemy.mag,
            SPR: enemy.spr
        };

        let rawDmg = 0;
        let i = 0;
        while (i < parseInt(enemyDmgDice[0])) {
            i++;
            rawDmg += Math.floor(Math.random() * parseInt(enemyDmgDice[1]));
        };
        const addDmg = parseInt(enemyDmgAdd[0]) * enemyObject[enemyDmgAdd[1]];
        const enemyRawDmg = rawDmg + addDmg;
        const enemyNetDmg = enemyRawDmg - enemyObject[enemy.damagetype];
        player.currhp -= Math.max(1, enemyNetDmg);
        return Math.max(1, enemyNetDmg);
    };

    client.playerCastSingleDamage = async (player, enemy, ability) => {
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
        const addDmg = parseInt(dmgAdd[0] * type[dmgAdd[1]]);
        const grossDmg = rawDmg + addDmg;
        const netDmg = grossDmg - type[ability.damagetype];
        player.enemyhp -= Math.max(1, netDmg);
        player.currmp -= ability.mana;
        player.cooldowns[player.abilities.indexOf(ability.name)] -= 1;
        return Math.max(1, netDmg);
    };

    client.playerCastSingleHeal = async (player, ability) => {
        const dmgDice = ability.damage.split(' + ')[0];
        const dmgAdd = ability.damage.split(' + ')[1];

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
            rawDmg += Math.floor(Math.random() * parseInt(dmgDice[1]));
        };
        const addDmg = parseInt(dmgAdd[0] * type[dmgAdd[1]]);
        const grossDmg = rawDmg + addDmg;
        player.currhp += grossDmg;
        if (player.currhp > player.maxhp) player.currhp = player.maxhp;
        player.currmp -= ability.mana;
        player.cooldowns[player.abilities.indexOf(ability.name)] -= 1;
        return grossDmg;
    };

    client.enemyCastSingleHeal = async (enemy, ability) => {
        const dmgDice = ability.damage.split(' + ')[0];
        const dmgAdd = ability.damage.split(' + ')[1];

        let rawDmg = 0;
        let i = 0;
        while (i < parseInt(dmgDice[0])) {
            i++;
            rawDmg += Math.floor(Math.random() * parseInt(dmgDice[1]));
        };
        const addDmg = parseInt(dmgAdd[0] * type[dmgAdd[1]]);
        const grossDmg = rawDmg + addDmg;
        player.enemyhp += grossDmg;
        if (player.enemyhp > enemy.hp) player.enemyhp = enemy.hp;
        player.enemymp -= ability.mana;
        player.enemycd[enemy.abilities.indexOf(ability.name)] -= 1;
        return grossDmg;
    }

    client.enemyCastSingleDamage = async (enemy, player, ability) => {
        const dmgDice = ability.damage.split(' + ')[0];
        const dmgAdd = ability.damage.split(' + ')[1];
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
            rawDmg += Math.floor(Math.random() * parseInt(dmgDice[1]));
        };
        const addDmg = parseInt(dmgAdd[0] * type[dmgAdd[1]]);
        const grossDmg = rawDmg + addDmg;
        const netDmg = grossDmg - type[ability.damagetype];
        player.enemymp -= ability.mana;
        player.enemycd[enemy.abilities.indexOf(ability.name)] -= 1;
        return Math.max(1, netDmg);
    }
}