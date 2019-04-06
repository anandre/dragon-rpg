module.exports = (client) => {
    client.clean = async (client, text) => {
        if (text && text.constructor.name == "Promise")
        text = await text;
        if (typeof evaled !== "string")
        text = require("util").inspect(text, {depth: 1});

        text = text
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203))
            .replace(client.token, "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");

    return text;
    };

    client.execute = function(t) {
        const ms = parseInt((t)%1000);
        const absoluteSeconds = parseInt((t/(1000))%60);
        const absoluteMinutes = parseInt((t/(1000*60))%60);
        const absoluteHours = parseInt((t/(1000*60*60))%24);
        const absoluteDays = parseInt((t/(1000*60*60*24)));
    
        const d = absoluteDays > 0 ? absoluteDays === 1 ? "1 day" : `${absoluteDays} days` : null;
        const h = absoluteHours > 0 ? absoluteHours === 1 ? "1 hour" : `${absoluteHours} hours` : null;
        const m = absoluteMinutes > 0 ? absoluteMinutes === 1 ? "1 minute" : `${absoluteMinutes} minutes` : null;
        const s = absoluteSeconds > 0 ? absoluteSeconds === 1 ? "1 second" : `${absoluteSeconds} seconds` : null;
    
        const absoluteTime = [];
        if (d) absoluteTime.push(d);
        if (h) absoluteTime.push(h);
        if (m) absoluteTime.push(m);
        if (s) absoluteTime.push(s);
    
        return absoluteTime.join(", ");
      }

    client.Path = function(name, description, str, agi, con, mag, spr, hpmod, mpmod, weapon, armor, accessory) {
        this.name = name;
        this.description = description;
        this.str = str;
        this.agi = agi;
        this.con = con;
        this.mag = mag;
        this.spr = spr;
        this.hpmod = hpmod;
        this.mpmod = mpmod;
        this.weapon = weapon;
        this.armor = armor;
        this.accessory = accessory;
    }

    client.warrior = new client.Path('Warrior', 'A well-paid mercenary, a bar brawler, a righteous paladin - all share a warrior\'s heart and dedication to their craft.  Strong of arm, body and heart, they are essential in the war against dragons.', 6, 3, 4, 2, 3, 50, 10, 25, 33, 48);
    client.mage = new client.Path('Mage', 'Cunning and mischieveous, their desire to learn is only matched by their hubris.  With a sharp mind and a tome of knowledge in hand, their destructive prowess is unparalleled and are closest to matching the raw strength of a dragon.', 1, 2, 2, 6, 4, 25, 30, 49, 57, 48);
    client.rogue = new client.Path('Rogue', 'As likely to steal a drink for you as to stab you in the back, never turn your back for a moment - not that it may even matter.  Their ability to deceive and get in anywhere has brought back valuable intelligence from many a dragon\'s hoard.', 3, 6, 3, 3, 2, 40, 15, 25, 33, 48);
    client.priest = new client.Path('Priest', 'Devout and wise, a priest is always there when needed, with a kind word or with sutures.  The caretakers of the realm, they tend to those who challenge the dragons\' supremacy.', 2, 2, 3, 4, 6, 30, 25, 49, 57, 48);

    client.gold = async function(userid) {
        const goldArray = [25, 25, 25, 50, 50, 100];
        const goldResult = goldArray[Math.floor(Math.random() * goldArray.length)];
        await client.db.query(`UPDATE players SET gold = gold + $1 WHERE playerid = $2`, [goldResult, userid])
        return goldResult;
    }

    client.fish = async function(userid, messageTime) {
        let end = [];
        await client.db.query(`UPDATE players SET fishtimer = $1 WHERE playerid = $2`, [messageTime, userid])
        let item = Math.random() * 100;
        if (item > 90) {
            const result = client.fishunc[Math.floor(Math.random() * client.fishunc.length)];
            const amt = Math.floor(Math.random() * 2 + 1);
            await client.db.query(`INSERT INTO ${'inv' + userid} (itemid, count) VALUES (${result.itemid}, ${amt}) ON CONFLICT (itemid) DO UPDATE SET count = (${'inv' + userid}.count + ${amt})`)
            end.push(result.name, amt);
            return end;
        }
        else if (item > 1) {
            const result = client.fishcom[Math.floor(Math.random() * client.fishcom.length)];
            const amt = Math.floor(Math.random() * 4 + 1);
            await client.db.query(`INSERT INTO ${'inv' + userid} (itemid, count) VALUES (${result.itemid}, ${amt}) ON CONFLICT (itemid) DO UPDATE SET count = (${'inv' + userid}.count + ${amt})`)
            end.push(result.name, amt);
            return end;
        }
        else return;
    }

    client.gather = async function(userid, messageTime) {
        let end = [];
        await client.db.query(`UPDATE players SET gathertimer = $1 WHERE playerid = $2`, [messageTime, userid]);
        const item = Math.random() * 100;
        if (item > 90) {
            const result = client.gathunc[Math.floor(Math.random() * client.gathunc.length)];
            const amt = Math.floor(Math.random() * 2 + 1);
            await client.db.query(`INSERT INTO ${'inv' + userid} (itemid, count) VALUES (${result.itemid}, ${amt}) ON CONFLICT (itemid) DO UPDATE SET count = (${'inv' + userid}.count + ${amt})`)
            end.push(result.name, amt);
            return end;
        }
        else if (item > 1) {
            const result = client.gathcom[Math.floor(Math.random() * client.gathcom.length)];
            const amt = Math.floor(Math.random() * 4 + 1);
            await client.db.query(`INSERT INTO ${'inv' + userid} (itemid, count) VALUES (${result.itemid}, ${amt}) ON CONFLICT (itemid) DO UPDATE SET count = (${'inv' + userid}.count + ${amt})`)
            end.push(result.name, amt);
            return end;
        }
        else return;
    }

    client.hunt = async function(userid, messageTime) {
        let end = [];
        await client.db.query('UPDATE players SET hunttimer = $1 WHERE playerid = $2', [messageTime, userid])
        const item = Math.random() * 100;
        console.log(`Random: ${item}`);
        if (item > 90) {
            const result = client.huntunc[Math.floor(Math.random() * client.huntunc.length)];
            console.log(`Result: ${result.name} + ${result.itemid}`)
            const amt = Math.floor(Math.random() * 2 + 1);
            await client.db.query(`INSERT INTO ${'inv' + userid} (itemid, count) VALUES (${result.itemid}, ${amt}) ON CONFLICT (itemid) DO UPDATE SET count = (${'inv' + userid}.count + ${amt})`)
            end.push(result.name, amt);
            return end;
        }
        else if (item > 1) {
            const result = client.huntcom[Math.floor(Math.random() * client.huntcom.length)]
            const amt = Math.floor(Math.random() * 4 + 1);
            console.log(`Result: ${result.name} + ${result.itemid}`)
            await client.db.query(`INSERT INTO ${'inv' + userid} (itemid, count) VALUES (${result.itemid}, ${amt}) ON CONFLICT (itemid) DO UPDATE SET count = (${'inv' + userid}.count + ${amt})`)
            end.push(result.name, amt);
            return end;
        }
        else return;
    }

    client.addXP = async function(userid, xp) {
        console.log('adding xp')
        client.db.query('UPDATE players SET xp = xp + $1 WHERE playerid = $2', [xp, userid]);
    }

    client.levelChart = {
        1: 5,
        2: 10,
        3: 50,
        4: 150
    }

    client.levelStats = {
        'Warrior': {
            1: {
                str: 3,
                agi: 1,
                con: 1,
                mag: 0,
                spr: 0,
                hp: 10,
                mp: 5

            },
            2: {
                str: 3,
                agi: 2,
                con: 1,
                mag: 0,
                spr: 1,
                hp: 10,
                mp: 0
            }
        },
        'Rogue': {
            1: {
                str: 1,
                agi: 3
            },
            2: {
                str: 2,
                agi: 5
            }
        }
    }

    client.checkXP = async function(message) {
        console.log('checking xp')
        const currXP = (await client.db.query('SELECT path, xp, level, str, agi, con, mag, spr, currhp, maxhp, currmp, maxmp FROM players WHERE playerid = $1', [message.author.id])).rows[0]
        console.log(currXP);
        const xpNeeded = client.levelChart[currXP.level];
        console.log(xpNeeded);
        if (currXP.xp < xpNeeded) {
            return console.log('not time to level up');
        }
        else {
            console.log('leveling up time!');
            await client.db.query("UPDATE players SET xp = $1, level = $2, str = $4, agi = $5, con = $6, mag = $7, spr = $8, currhp = $9, maxhp = $10, currmp = $11, maxmp = $12 WHERE playerid = $3", [currXP.xp - client.levelChart[currXP.level], currXP.level + 1, message.author.id, currXP.str + client.levelStats[currXP.path][currXP.level].str, currXP.agi + client.levelStats[currXP.path][currXP.level].agi, currXP.con + client.levelStats[currXP.path][currXP.level].con, currXP.mag + client.levelStats[currXP.path][currXP.level].mag, currXP.spr + client.levelStats[currXP.path][currXP.level].spr, currXP.currhp + client.levelStats[currXP.path][currXP.level].hp, currXP.maxhp + client.levelStats[currXP.path][currXP.level].hp, currXP.currmp + client.levelStats[currXP.path][currXP.level].mp, currXP.maxmp + client.levelStats[currXP.path][currXP.level].mp])
            return await message.channel.send(`You have leveled up!  Now level ${currXP.level + 1} with ${currXP.xp - client.levelChart[currXP.level]} XP!`)
        }
    }
}