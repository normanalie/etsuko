const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('usurp')
        .setDescription("Envoie un message à la place de quelqu'un d'autre")
        .addUserOption(option => 
            option.setName('cible')
                .setDescription("La personne que tu souhaites usurper")
                .setRequired(true))
        .addStringOption(option => 
            option.setName('prompt')
                .setDescription("Le message que tu veux que la personne envoie")
                .setRequired(true)),
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

        // Get the details for the message
        const target = interaction.options.getMember('cible');
        const message = interaction.options.getString('prompt');
        const logChannel = interaction.guild.channels.cache.find(c => c.name === "log");

        // Cannot usurp yourself
        // if (target.id === interaction.user.id)
        //     return await interaction.editReply("Tu ne peux pas t'usurper");

        // Create a webhook to usurp the target and send the message
        let usurpMessage;
        await interaction.channel.createWebhook({name: target.displayName, avatar: target.user.displayAvatarURL()}).then(async w => {
            try {
                usurpMessage = await w.send(message);
            } catch (error) {
                await w.delete();
            }
            await w.delete();
        }).catch(() => {
            return;
        });

        // If there's a log channel on the server, send a message to inform the moderators
        if (logChannel) {
            let logEmbed = new EmbedBuilder()
                .setColor("Yellow")
                .setDescription(`${interaction.user} a usurpé ${target} :\n||https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${usurpMessage.id}||`)
                .setTimestamp();
            
            logChannel.send({ embeds: [logEmbed] });
        }
    }
}