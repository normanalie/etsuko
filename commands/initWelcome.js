const { SlashCommandBuilder } = require('discord.js')
const { sendWelcomeMessage } = require('../handlers/welcome')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('initwelcome')
        .setDescription('Envoie le formulaire de bienvenue dans le channel')
        .addChannelOption((option) =>
            option
                .setName('channel')
                .setDescription(
                    'Le channel dans lequel le message sera envoyé.'
                )
                .setRequired(true)
        ),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel')
        await sendWelcomeMessage(channel)
        // Terminer l'interaction pour éviter le message "L’application ne répond plus"
        await interaction.reply({
            content: 'Le formulaire de bienvenue a été envoyé dans le canal.',
            ephemeral: true,
        })
    },
}
