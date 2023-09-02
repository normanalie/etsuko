module.exports = {
    getMembers: function(message, toFind = '') {
        toFind = toFind.toLowerCase();

        let target = message.guild.members.cache.get(toFind);

        if (!target && message.mentions.members)
            target = message.mentions.members.first();

        if (!target && toFind) {
            target = message.guild.members.cache.find(member => {
                return member.displayName.toLowerCase().includes(toFind) ||
                member.user.tag.toLowerCase().includes(toFind)
            });
        }

        if (!target)
            target = message.member;

        return target;
    },

    formatDate: function(date) {
        return new Intl.DateTimeFormat('en-fr').format(date);
    },

    promptMessage: async function(message, author, time, validReactions) {
        time *= 1000;

        for (const reaction of validReactions) await message.react(reaction);

        const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;

        return message
            .awaitReactions({ filter, max: 1, time: time})
            .then(collected => collected.first() && collected.first().emoji.name)
            .catch(console.error);
    },

    getEmoji: async function(message, author, time, validReactions) {
        time *= 1000;

        const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;

        return message
            .awaitReactions({ filter, max: 1, time: time })
            .then(collected => collected.first() && collected.first().emoji.name)
            .catch(console.error);
    },

    shuffle: function(array) {
        var tmp, current, top = array.length;
        if (top) {
            while (--top) {
                current = Math.floor(Math.random() * (top + 1));
                tmp = array[current];
                array[current] = array[top];
                array[top] = tmp;
            }
        }
        return array;
    },

    React: async function(message, personne, validReactions) {

        for (const reaction of validReactions) await message.react(reaction);

        const filter = (reaction) => validReactions.includes(reaction.emoji.name);

        personne.value = user.id;

        return message
            .awaitReactions(filter)
            .then(collected => collected.first() && collected.first().emoji.name);
    },

    replyTmpMessage: function(message, reply, timeout) {
        return message.reply(reply).then(m => {
            setTimeout(() => {
                if (m.deletable) m.delete();
                if (message.deletable) message.delete();
            }, timeout);
        });
    },

    compareArrays: function(a, b) {
        return a.length === b.length && a.every((element, index) => element === b[index]);
    }
}