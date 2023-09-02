const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('eau')
        .setDescription("Envoie ton message en transformant les 'o' en 'eau'")
        .addStringOption(option => 
            option.setName('prompt')
                .setDescription("Le message que tu veux que je transforme")
                .setRequired(true)),
    async execute(interaction) {
        // Send message to inform that the command is starting
        try {
            await interaction.deferReply({ fetchReply: true });
        } catch (error) {
            return;
        }

        // Change the 'o' in the entry by 'eau'
        let lettres = interaction.options.getString('prompt').split('');
        for (let i = 0; i < lettres.length; i++) {
            if (lettres[i] === "o")
                lettres[i] = "eau";
            if (lettres[i] === "O")
                lettres[i] = "EAU";
        }

        const member = interaction.member;
        const message = lettres.join('').toString();

        // Delete the current the interaction message
        try {
            await interaction.deleteReply();
        } catch (error) {
            
        }

        // Create a weabhook to imitate the user and send the changed message
        interaction.channel.createWebhook({ name: member.displayName, avatar: member.user.displayAvatarURL() }).then(async w => {
            await w.send(message);
            w.delete();
        }).catch(() => {
            return;
        });
    }
}