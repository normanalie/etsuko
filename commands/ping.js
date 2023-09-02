const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Renvoie la latence"),
    async execute(interaction) {
        let sent;
        // Send message to inform that the command is starting
        try {
            sent = await interaction.deferReply({ fetchReply: true });
        } catch (error) {}
        await wait(1000);

        // Edit the message with the ping
        try {
            await interaction.editReply(`Latence : ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
        } catch (error) {}
    }
}