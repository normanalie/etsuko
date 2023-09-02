const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription("Redis ton message via le bot")
        .addStringOption(option =>
            option.setName('prompt')
                .setDescription("Le message que tu veux que le bot envoie")
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName('embed')
                .setDescription("Veux-tu que le message soit dans un embed ?")),
    async execute(interaction) {
        // Send message to inform that the command is starting
        try {
            await interaction.deferReply({ fetchReply: true });
        } catch (error) {
            return;
        }

        // Delete the interaction message
        try {
            await interaction.deleteReply();
        } catch (error) {
            
        }

        // Get all details for the message
        const isEmbed = interaction.options.getBoolean('embed');
        const message = interaction.options.getString('prompt');
        const messageChannel = interaction.channel;
        const logChannel = interaction.guild.channels.cache.find(c => c.name === "log");
        const clientMember = interaction.guild.members.cache.find(m => m.user.id === interaction.client.user.id);
        const roleColor = clientMember.displayHexColor === "#000000" ? "#ffffff" : clientMember.displayHexColor;

        // Send the message
        let usurpMessage;
        if (isEmbed) {
            let messageEmbed = new EmbedBuilder()
                .setColor(roleColor)
                .setDescription(message);
            usurpMessage = await messageChannel.send({ embeds: [messageEmbed] });
        } else {
            usurpMessage = await messageChannel.send(message);
        }

        // If there's a log channel on the server, send a message to inform the moderators
        if (logChannel) {
            let logEmbed = new EmbedBuilder()
                .setColor(roleColor)
                .setDescription(`${interaction.user} a utilisé la commande 'say' :\n||https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${usurpMessage.id}||`)
                .setTimestamp();
            
            logChannel.send({ embeds: [logEmbed] });
        }
    }
}