const { SlashCommandBuilder } = require('discord.js')
const wait = require('node:timers/promises').setTimeout

module.exports = {
    data: new SlashCommandBuilder()
        .setName('r')
        .setDescription('Lance un dé')
        .addIntegerOption((option) =>
            option
                .setName('d')
                .setDescription('Le nombre de faces sur le dé')
                .setMinValue(1)
                .setRequired(true)
        ),
    async execute(interaction) {
        // Send message to inform that the command is starting
        try {
            await interaction.deferReply({ fetchReply: true })
        } catch (error) {
            console.error(error)
        }
        await wait(1000)

        // Get the result and send it
        let dice = interaction.options.getInteger('d')
        let result = Math.floor(Math.random() * dice) + 1
        try {
            await interaction.editReply(
                `Le résultat du **d${dice}** est **${result}**`
            )
        } catch (error) {
            console.error(error)
        }
    },
}
