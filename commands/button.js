const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('button')
        .setDescription("test"),
    async execute(interaction) {

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('test')
                    .setLabel('Click me!')
                    .setStyle(ButtonStyle.Primary),
            );
        
        await interaction.reply({ content: 'I think you should,', components: [row] });
    }
}