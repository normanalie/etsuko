const { SlashCommandBuilder } = require('discord.js')
const wait = require('node:timers/promises').setTimeout
const { newMemberWelcome } = require('../handlers/welcome')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('testwelcome')
        .setDescription('Affiche le message de welcome'),
    async execute(interaction) {
        await newMemberWelcome(interaction.user)
    },
}
