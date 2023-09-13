const {
    Client,
    Collection,
    GatewayIntentBits,
    Partials,
    Events,
} = require('discord.js')
require('dotenv').config()
const fs = require('fs')
const path = require('path')

const { handleSlashCommand } = require('./handlers/commands')

//
const Etudiants = {
    CPI1: 0,
    CPI2: 1,
    MT3: 2,
    MT4: 3,
    MT5: 4,
    IATIC3: 5,
    IATIC4: 6,
    IATIC5: 7,
    SEE3: 8,
    SEE4: 9,
    SEE5: 10,
    SNPI3: 11,
    SNPI4: 12,
    SNPI5: 13,
    M1CHPS: 14,
    M2CHPS: 15,
    M1IRS: 16,
    M2IRS: 17,
}

// Roles ID
var allemandCpi2 = '1147089909736292382'
var espagnolCpi2 = '1147089915176300555'
var allemandIatic3 = '1147089937414496317'
var espagnolIatic3 = '1147089942711894047'
var chinoisIatic3 = '1147089947317239825'
var allemandIatic4 = '1014655942547210260'
var espagnolIatic4 = '1014655946930278533'
var chinoisIatic4 = '1014655951212650607'
// Temporary for role changing
var allemandCpi2Tmp
var espagnolCpi2Tmp
var allemandIatic3Tmp
var espagnolIatic3Tmp
var chinoisIatic3Tmp
var allemandIatic4Tmp
var espagnolIatic4Tmp
var chinoisIatic4Tmp

const client = require('./connect')

client.on('ready', () => {
    client.user.setPresence({ status: 'online' })
    console.log(
        `\n\x1b[32m🚀 I am now online, my name is ${client.user.username}\x1b[0m`
    )
})

client.on(Events.InteractionCreate, async (interaction) => {
    //Commands
    if (interaction.isChatInputCommand()) {
        try {
            await handleSlashCommand(interaction)
        } catch (error) {
            console.error(error)
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: 'There was an error while executing this command!',
                    ephemeral: true,
                })
            } else {
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    ephemeral: true,
                })
            }
        }
    }
})

// Wait for messages in specific channel to add emoji reactions
client.on('messageCreate', async (message) => {
    /// => buttons ?
    if (message.channel.id === '884497820743237692') {
        await message
            .react('📖')
            .then(() => message.react('📚'))
            .then(() => message.react('🧑‍🔧'))
            .then(() => message.react('🦿'))
            .then(() => message.react('🦾'))
            .then(() => message.react('🧑‍💻'))
            .then(() => message.react('🖥️'))
            .then(() => message.react('💻'))
            .then(() => message.react('💡'))
            .then(() => message.react('📡'))
            .then(() => message.react('🛰️'))
            .then(() => message.react('🧑‍🏭'))
            .then(() => message.react('🤖'))
            .then(() => message.react('🏭'))
            .then(() => message.react('🌍'))
            .then(() => message.react('🌑'))
            .then(() => message.react('🔥'))
            .then(() => message.react('💥'))
            .then(() => message.react('🧑‍🦳'))
            .then(() => message.react('🧑‍🌾'))
    }

    if (message.channel.id === '884498054466666587') {
        message.react('🇩🇪').then(() => message.react('🇪🇸'))
    }

    if (message.channel.id === '884498154794414080') {
        message
            .react('🇩🇪')
            .then(() => message.react('🇪🇸'))
            .then(() => message.react('🇨🇳'))
    }

    if (message.channel.id === '884842022589050900') {
        message
            .react('🎮')
            .then(() => message.react('❌'))
            .then(() => message.react('🛋️'))
            .then(() => message.react('🚪'))
    }

    if (message.channel.id === '884834854615785522') {
        message.react('🔄')
    }

    if (message.channel.id === '886387568093065226') {
        message.react('🧐').then(() => message.react('😎'))
    }
})

client.on('messageReactionAdd', (messageReaction, user) => {
    if (user.bot) return

    let role
    let etud = false

    switch (messageReaction.message.channel.id) {
        case '884497820743237692':
            switch (messageReaction.emoji.name) {
                case '📖':
                    if (
                        !messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.name === 'CPI 1')
                    ) {
                        role = messageReaction.message.guild.roles.cache.find(
                            (r) => r.name === 'CPI 1'
                        )
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.add(role.id)
                    }
                    etud = true
                    break

                case '📚':
                    if (
                        !messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.name === 'CPI 2')
                    ) {
                        role = messageReaction.message.guild.roles.cache.find(
                            (r) => r.name === 'CPI 2'
                        )
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.add(role.id)
                    }
                    etud = true
                    break

                case '🧑‍🔧':
                    if (
                        !messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.name === 'MT 3')
                    ) {
                        role = messageReaction.message.guild.roles.cache.find(
                            (r) => r.name === 'MT 3'
                        )
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.add(role.id)
                    }
                    etud = true
                    break

                case '🦿':
                    if (
                        !messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.name === 'MT 4')
                    ) {
                        role = messageReaction.message.guild.roles.cache.find(
                            (r) => r.name === 'MT 4'
                        )
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.add(role.id)
                    }
                    etud = true
                    break

                case '🦾':
                    if (
                        !messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.name === 'MT 5')
                    ) {
                        role = messageReaction.message.guild.roles.cache.find(
                            (r) => r.name === 'MT 5'
                        )
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.add(role.id)
                    }
                    etud = true
                    break

                case '🧑‍💻':
                    if (
                        !messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.name === 'IATIC 3')
                    ) {
                        role = messageReaction.message.guild.roles.cache.find(
                            (r) => r.name === 'IATIC 3'
                        )
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.add(role.id)
                    }
                    etud = true
                    break

                case '🖥️':
                    if (
                        !messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.name === 'IATIC 4')
                    ) {
                        role = messageReaction.message.guild.roles.cache.find(
                            (r) => r.name === 'IATIC 4'
                        )
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.add(role.id)
                    }
                    etud = true
                    break

                case '💻':
                    if (
                        !messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.name === 'IATIC 5')
                    ) {
                        role = messageReaction.message.guild.roles.cache.find(
                            (r) => r.name === 'IATIC 5'
                        )
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.add(role.id)
                    }
                    etud = true
                    break

                case '💡':
                    if (
                        !messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.name === 'SEE 3')
                    ) {
                        role = messageReaction.message.guild.roles.cache.find(
                            (r) => r.name === 'SEE 3'
                        )
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.add(role.id)
                    }
                    etud = true
                    break

                case '📡':
                    if (
                        !messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.name === 'SEE 4')
                    ) {
                        role = messageReaction.message.guild.roles.cache.find(
                            (r) => r.name === 'SEE 4'
                        )
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.add(role.id)
                    }
                    etud = true
                    break

                case '🛰️':
                    if (
                        !messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.name === 'SEE 5')
                    ) {
                        role = messageReaction.message.guild.roles.cache.find(
                            (r) => r.name === 'SEE 5'
                        )
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.add(role.id)
                    }
                    etud = true
                    break

                case '🧑‍🏭':
                    if (
                        !messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.name === 'SNPI 3')
                    ) {
                        role = messageReaction.message.guild.roles.cache.find(
                            (r) => r.name === 'SNPI 3'
                        )
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.add(role.id)
                    }
                    etud = true
                    break

                case '🤖':
                    if (
                        !messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.name === 'SNPI 4')
                    ) {
                        role = messageReaction.message.guild.roles.cache.find(
                            (r) => r.name === 'SNPI 4'
                        )
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.add(role.id)
                    }
                    etud = true
                    break

                case '🏭':
                    if (
                        !messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.name === 'SNPI 5')
                    ) {
                        role = messageReaction.message.guild.roles.cache.find(
                            (r) => r.name === 'SNPI 5'
                        )
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.add(role.id)
                    }
                    etud = true
                    break

                case '🌍':
                    if (
                        !messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.name === 'M1 IRS')
                    ) {
                        role = messageReaction.message.guild.roles.cache.find(
                            (r) => r.name === 'M1 IRS'
                        )
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.add(role.id)
                    }
                    etud = true
                    break

                case '🌑':
                    if (
                        !messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.name === 'M2 IRS')
                    ) {
                        role = messageReaction.message.guild.roles.cache.find(
                            (r) => r.name === 'M2 IRS'
                        )
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.add(role.id)
                    }
                    etud = true
                    break

                case '🔥':
                    if (
                        !messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.name === 'M1 CHPS')
                    ) {
                        role = messageReaction.message.guild.roles.cache.find(
                            (r) => r.name === 'M1 CHPS'
                        )
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.add(role.id)
                    }
                    etud = true
                    break

                case '💥':
                    if (
                        !messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.name === 'M2 CHPS')
                    ) {
                        role = messageReaction.message.guild.roles.cache.find(
                            (r) => r.name === 'M2 CHPS'
                        )
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.add(role.id)
                    }
                    etud = true
                    break

                case '🧑‍🦳':
                    if (
                        !messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.name === 'Anciens étudiants')
                    ) {
                        role = messageReaction.message.guild.roles.cache.find(
                            (r) => r.name === 'Anciens étudiants'
                        )
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.add(role.id)
                    }
                    if (
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.name === 'Filière non choisie')
                    ) {
                        role = messageReaction.message.guild.roles.cache.find(
                            (r) => r.name === 'Filière non choisie'
                        )
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.remove(role.id)
                    }
                    break

                case '🧑‍🌾':
                    if (
                        !messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.name === 'Squatteur/Plébéien')
                    ) {
                        role = messageReaction.message.guild.roles.cache.find(
                            (r) => r.name === 'Squatteur/Plébéien'
                        )
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.add(role.id)
                    }
                    if (
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.name === 'Filière non choisie')
                    ) {
                        role = messageReaction.message.guild.roles.cache.find(
                            (r) => r.name === 'Filière non choisie'
                        )
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.remove(role.id)
                    }
                    break

                default:
                    break
            }

            if (etud) {
                if (
                    !messageReaction.message.guild.members.cache
                        .find((m) => m.id === user.id)
                        .roles.cache.filter(
                            (r) => r.id !== messageReaction.message.guild.id
                        )
                        .find((r) => r.name === 'Étudiant')
                ) {
                    role = messageReaction.message.guild.roles.cache.find(
                        (r) => r.name === 'Étudiant'
                    )
                    messageReaction.message.guild.members.cache
                        .find((m) => m.id === user.id)
                        .roles.add(role.id)
                }
                if (
                    messageReaction.message.guild.members.cache
                        .find((m) => m.id === user.id)
                        .roles.cache.filter(
                            (r) => r.id !== messageReaction.message.guild.id
                        )
                        .find((r) => r.name === 'Filière non choisie')
                ) {
                    role = messageReaction.message.guild.roles.cache.find(
                        (r) => r.name === 'Filière non choisie'
                    )
                    messageReaction.message.guild.members.cache
                        .find((m) => m.id === user.id)
                        .roles.remove(role.id)
                }
            }

            messageReaction.users.remove(user.id)
            break

        case '884498054466666587':
            switch (messageReaction.emoji.name) {
                case '🇩🇪':
                    if (
                        !messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.id === allemandCpi2)
                    ) {
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.add(allemandCpi2)
                    }
                    break

                case '🇪🇸':
                    if (
                        !messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.id === espagnolCpi2)
                    ) {
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.add(espagnolCpi2)
                    }
                    break

                default:
                    break
            }

            messageReaction.users.remove(user.id)
            break

        case '884498154794414080':
            switch (messageReaction.emoji.name) {
                case '🇩🇪':
                    if (
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.name === 'IATIC 3')
                    ) {
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.add(allemandIatic3)
                    }
                    if (
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.name === 'IATIC 4')
                    ) {
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.add(allemandIatic4)
                    }
                    break

                case '🇪🇸':
                    if (
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.name === 'IATIC 3')
                    ) {
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.add(espagnolIatic3)
                    }
                    if (
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.name === 'IATIC 4')
                    ) {
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.add(espagnolIatic4)
                    }
                    break

                case '🇨🇳':
                    if (
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.name === 'IATIC 3')
                    ) {
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.add(chinoisIatic3)
                    }
                    if (
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.name === 'IATIC 4')
                    ) {
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.add(chinoisIatic4)
                    }
                    break

                default:
                    break
            }

            messageReaction.users.remove(user.id)
            break

        case '884842022589050900':
            switch (messageReaction.emoji.name) {
                case '🎮':
                    if (
                        !messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.name === 'Gamer')
                    ) {
                        role = messageReaction.message.guild.roles.cache.find(
                            (r) => r.name === 'Gamer'
                        )
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.add(role.id)
                    }
                    break

                case '❌':
                    if (
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.name === 'Gamer')
                    ) {
                        role = messageReaction.message.guild.roles.cache.find(
                            (r) => r.name === 'Gamer'
                        )
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.remove(role.id)
                    }
                    break

                case '🛋️':
                    if (
                        !messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.name === 'Détente')
                    ) {
                        role = messageReaction.message.guild.roles.cache.find(
                            (r) => r.name === 'Détente'
                        )
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.add(role.id)
                    }
                    break

                case '🚪':
                    if (
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.name === 'Détente')
                    ) {
                        role = messageReaction.message.guild.roles.cache.find(
                            (r) => r.name === 'Détente'
                        )
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.remove(role.id)
                    }
                    break

                default:
                    break
            }

            messageReaction.users.remove(user.id)
            break

        case '886387568093065226':
            switch (messageReaction.emoji.name) {
                case '🧐':
                    if (
                        !messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.name === 'Monocle de Vérité')
                    ) {
                        role = messageReaction.message.guild.roles.cache.find(
                            (r) => r.name === 'Monocle de Vérité'
                        )
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.add(role.id)
                    }
                    break

                case '😎':
                    if (
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.cache.filter(
                                (r) => r.id !== messageReaction.message.guild.id
                            )
                            .find((r) => r.name === 'Monocle de Vérité')
                    ) {
                        role = messageReaction.message.guild.roles.cache.find(
                            (r) => r.name === 'Monocle de Vérité'
                        )
                        messageReaction.message.guild.members.cache
                            .find((m) => m.id === user.id)
                            .roles.remove(role.id)
                    }
                    break

                default:
                    break
            }

            messageReaction.users.remove(user.id)
            break

        case '884834854615785522':
            switch (messageReaction.emoji.name) {
                case '🔄':
                    add_role_by_name(
                        messageReaction.message,
                        user,
                        'Filière non choisie'
                    )
                    remove_role_by_name(messageReaction.message, user, 'CPI 1')
                    remove_role_by_name(messageReaction.message, user, 'CPI 2')
                    remove_role_by_name(messageReaction.message, user, 'MT 3')
                    remove_role_by_name(messageReaction.message, user, 'MT 4')
                    remove_role_by_name(messageReaction.message, user, 'MT 5')
                    remove_role_by_name(
                        messageReaction.message,
                        user,
                        'IATIC 3'
                    )
                    remove_role_by_name(
                        messageReaction.message,
                        user,
                        'IATIC 4'
                    )
                    remove_role_by_name(
                        messageReaction.message,
                        user,
                        'IATIC 5'
                    )
                    remove_role_by_name(messageReaction.message, user, 'SEE 3')
                    remove_role_by_name(messageReaction.message, user, 'SEE 4')
                    remove_role_by_name(messageReaction.message, user, 'SEE 5')
                    remove_role_by_name(messageReaction.message, user, 'SNPI 3')
                    remove_role_by_name(messageReaction.message, user, 'SNPI 4')
                    remove_role_by_name(messageReaction.message, user, 'SNPI 5')
                    remove_role_by_name(
                        messageReaction.message,
                        user,
                        'M1 CHPS'
                    )
                    remove_role_by_name(
                        messageReaction.message,
                        user,
                        'M2 CHPS'
                    )
                    remove_role_by_name(messageReaction.message, user, 'M1 IRS')
                    remove_role_by_name(messageReaction.message, user, 'M2 IRS')
                    remove_role_by_name(
                        messageReaction.message,
                        user,
                        'Anciens étudiants'
                    )
                    remove_role_by_name(
                        messageReaction.message,
                        user,
                        'Squatteur/Plébéien'
                    )
                    remove_role_by_id(
                        messageReaction.message,
                        user,
                        allemandCpi2
                    )
                    remove_role_by_id(
                        messageReaction.message,
                        user,
                        espagnolCpi2
                    )
                    remove_role_by_id(
                        messageReaction.message,
                        user,
                        allemandIatic3
                    )
                    remove_role_by_id(
                        messageReaction.message,
                        user,
                        espagnolIatic3
                    )
                    remove_role_by_id(
                        messageReaction.message,
                        user,
                        chinoisIatic3
                    )
                    remove_role_by_id(
                        messageReaction.message,
                        user,
                        allemandIatic4
                    )
                    remove_role_by_id(
                        messageReaction.message,
                        user,
                        espagnolIatic4
                    )
                    remove_role_by_id(
                        messageReaction.message,
                        user,
                        chinoisIatic4
                    )
                    remove_role_by_name(
                        messageReaction.message,
                        user,
                        'Étudiant'
                    )
                    break

                default:
                    break
            }

            messageReaction.users.remove(user.id)
            break

        default:
            break
    }
})

function remove_role_by_name(message, user, roleName) {
    if (
        message.guild.members.cache
            .find((m) => m.id === user.id)
            .roles.cache.filter((r) => r.id !== message.guild.id)
            .find((r) => r.name === roleName)
    ) {
        role = message.guild.roles.cache.find((r) => r.name === roleName)
        message.guild.members.cache
            .find((m) => m.id === user.id)
            .roles.remove(role.id)
    }
}

function remove_role_by_id(message, user, roleId) {
    if (
        message.guild.members.cache
            .find((m) => m.id === user.id)
            .roles.cache.filter((r) => r.id !== message.guild.id)
            .find((r) => r.id === roleId)
    ) {
        message.guild.members.cache
            .find((m) => m.id === user.id)
            .roles.remove(roleId)
    }
}

function add_role_by_name(message, user, roleName) {
    if (
        !message.guild.members.cache
            .find((m) => m.id === user.id)
            .roles.cache.filter((r) => r.id !== message.guild.id)
            .find((r) => r.name === roleName)
    ) {
        role = message.guild.roles.cache.find((r) => r.name === roleName)
        message.guild.members.cache
            .find((m) => m.id === user.id)
            .roles.add(role.id)
    }
}

function has_role_by_name(message, user, roleName) {
    return message.guild.members.cache
        .find((m) => m.id === user.id)
        .roles.cache.filter((r) => r.id !== message.guild.id)
        .find((r) => r.name === roleName)
}

async function change_category_name(message, oldName, newName) {
    let channel = await message.guild.channels.cache.find(
        (c) => c.name === oldName && c.type === 'category'
    )
    if (channel != undefined) {
        await channel.setName(newName)
    }
}

async function change_role_name(message, oldName, newName, color) {
    let role = await message.guild.roles.cache.find((r) => r.name === oldName)
    if (role != undefined) {
        await role.setName(newName).then((r) => {
            if (color != undefined) {
                r.setColor(color)
            }
        })
    }
}

async function get_role_color(message, name) {
    let role = await message.guild.roles.cache.find((r) => r.name === name)
    if (role != undefined) {
        return role.color
    } else {
        return 0
    }
}

async function create_category(
    message,
    roleEve,
    roleModo,
    roleMono,
    roleEtu,
    name
) {
    console.log('Category name :', name)

    const channelOptions = {
        type: 'category',
        permissionOverwrites: [
            {
                id: roleEve.id,
                deny: ['VIEW_CHANNEL'],
            },
            {
                id: roleModo.id,
                allow: ['SEND_MESSAGES'],
            },
            {
                id: roleEtu.id,
                allow: ['VIEW_CHANNEL', 'MANAGE_CHANNELS'],
            },
            {
                id: roleMono.id,
                allow: ['VIEW_CHANNEL'],
                deny: ['SEND_MESSAGES'],
            },
        ],
    }

    // const category = await message.guild.channels.create(name, channelOptions);
    console.log('Before channel creation')
    const category = await message.guild.channels.create(name)
    console.log('After channel creation')
    return category.id
}

async function create_text_channel(
    message,
    roleEve,
    roleModo,
    roleMono,
    roleEtu,
    name,
    categoryId,
    position
) {
    let channel
    message.guild.channels
        .create(name)
        .then((c) => {
            c.setParent(categoryId)
            c.setPosition(position)
            channel = c
        })
        .then(() => {
            channel.overwritePermissions([
                {
                    id: roleEve.id,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: roleModo.id,
                    allow: ['SEND_MESSAGES'],
                },
                {
                    id: roleEtu.id,
                    allow: ['VIEW_CHANNEL'],
                    deny: ['MANAGE_CHANNELS'],
                },
                {
                    id: roleMono.id,
                    allow: ['VIEW_CHANNEL'],
                    deny: ['SEND_MESSAGES'],
                },
            ])
        })
}

async function create_lang_channel(
    message,
    roleEve,
    roleModo,
    roleMono,
    roleEtu,
    name,
    categoryId,
    position,
    roleLang
) {
    let channel
    message.guild.channels
        .create(name)
        .then((c) => {
            c.setParent(categoryId)
            c.setPosition(position)
            channel = c
        })
        .then(() => {
            channel.overwritePermissions([
                {
                    id: roleEve.id,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: roleModo.id,
                    allow: ['SEND_MESSAGES'],
                },
                {
                    id: roleEtu.id,
                    deny: ['MANAGE_CHANNELS'],
                },
                {
                    id: roleLang.id,
                    allow: ['VIEW_CHANNEL'],
                },
                {
                    id: roleMono.id,
                    allow: ['VIEW_CHANNEL'],
                    deny: ['SEND_MESSAGES'],
                },
            ])
        })
}

async function create_voice_channel(
    message,
    roleEve,
    roleModo,
    roleMono,
    roleEtu,
    name,
    categoryId,
    position
) {
    let channel
    message.guild.channels
        .create(name, { type: 'voice' })
        .then((c) => {
            c.setParent(categoryId)
            c.setPosition(position)
            channel = c
        })
        .then(() => {
            channel.overwritePermissions([
                {
                    id: roleEve.id,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: roleModo.id,
                    allow: ['CONNECT'],
                },
                {
                    id: roleEtu.id,
                    allow: ['VIEW_CHANNEL'],
                    deny: ['MANAGE_CHANNELS'],
                },
                {
                    id: roleMono.id,
                    allow: ['VIEW_CHANNEL'],
                    deny: ['CONNECT'],
                },
            ])
        })
}

async function create_complet_category(
    message,
    roleEve,
    roleModo,
    roleMono,
    roleEtu,
    name
) {
    let categoryId = await create_category(
        message,
        roleEve,
        roleModo,
        roleMono,
        roleEtu,
        name
    )
    await create_text_channel(
        message,
        roleEve,
        roleModo,
        roleMono,
        roleEtu,
        '『📰』news',
        categoryId,
        1
    )
    await create_text_channel(
        message,
        roleEve,
        roleModo,
        roleMono,
        roleEtu,
        '『💭』cours',
        categoryId,
        2
    )
    await create_text_channel(
        message,
        roleEve,
        roleModo,
        roleMono,
        roleEtu,
        '『📔』agenda',
        categoryId,
        3
    )
    await create_text_channel(
        message,
        roleEve,
        roleModo,
        roleMono,
        roleEtu,
        '『💯』hors-sujet',
        categoryId,
        4
    )
    await create_voice_channel(
        message,
        roleEve,
        roleModo,
        roleMono,
        roleEtu,
        '『🔊』Amphi A',
        categoryId,
        1
    )
    await create_voice_channel(
        message,
        roleEve,
        roleModo,
        roleMono,
        roleEtu,
        '『🔊』Amphi B',
        categoryId,
        2
    )
    await create_voice_channel(
        message,
        roleEve,
        roleModo,
        roleMono,
        roleEtu,
        '『🔊』Amphi C',
        categoryId,
        3
    )

    if (name === 'IATIC 3') {
        let allemandIatic3Role = await message.guild.roles.cache.find(
            (r) => r.id === allemandIatic3
        )
        if (allemandIatic3Role != undefined)
            await create_lang_channel(
                message,
                roleEve,
                roleModo,
                roleMono,
                roleEtu,
                '『🇩🇪』allemand',
                categoryId,
                3,
                allemandIatic3Role
            )
        let espagnolIatic3Role = await message.guild.roles.cache.find(
            (r) => r.id === espagnolIatic3
        )
        if (espagnolIatic3Role != undefined)
            await create_lang_channel(
                message,
                roleEve,
                roleModo,
                roleMono,
                roleEtu,
                '『🇪🇸』espagnol',
                categoryId,
                3,
                espagnolIatic3Role
            )
        let chinoisIatic3Role = await message.guild.roles.cache.find(
            (r) => r.id === chinoisIatic3
        )
        if (chinoisIatic3Role != undefined)
            await create_lang_channel(
                message,
                roleEve,
                roleModo,
                roleMono,
                roleEtu,
                '『🇨🇳』chinois',
                categoryId,
                3,
                chinoisIatic3Role
            )
    }
}

async function delete_category(message, name) {
    let category = await message.guild.channels.cache.find(
        (c) => c.name === name && c.type === 'category'
    )
    if (category != undefined) {
        await category.children.forEach((c) => c.delete())
        await category.delete()
    }
}

async function delete_channel_in_category(message, nameChannel, nameCategory) {
    let category = await message.guild.channels.cache.find(
        (c) => c.name === nameCategory && c.type === 'category'
    )
    if (category != undefined) {
        let channel = await message.guild.channels.cache.find(
            (c) => c.name === nameChannel && c.parent === category
        )
        if (channel != undefined) {
            await channel.delete()
        }
    }
}

function reset_etu_role(message) {
    message.guild.members.cache.forEach((m) => {
        if (has_role_by_name(message, m, 'Étudiant')) {
            add_role_by_name(message, m, 'Filière non choisie')
        }
        remove_role_by_name(message, m, 'CPI 1')
        remove_role_by_name(message, m, 'CPI 2')
        remove_role_by_name(message, m, 'MT 3')
        remove_role_by_name(message, m, 'MT 4')
        remove_role_by_name(message, m, 'MT 5')
        remove_role_by_name(message, m, 'IATIC 3')
        remove_role_by_name(message, m, 'IATIC 4')
        remove_role_by_name(message, m, 'IATIC 5')
        remove_role_by_name(message, m, 'SEE 3')
        remove_role_by_name(message, m, 'SEE 4')
        remove_role_by_name(message, m, 'SEE 5')
        remove_role_by_name(message, m, 'SNPI 3')
        remove_role_by_name(message, m, 'SNPI 4')
        remove_role_by_name(message, m, 'SNPI 5')
        remove_role_by_name(message, m, 'M1 CHPS')
        remove_role_by_name(message, m, 'M2 CHPS')
        remove_role_by_name(message, m, 'M1 IRS')
        remove_role_by_name(message, m, 'M2 IRS')
        remove_role_by_id(message, m, allemandCpi2)
        remove_role_by_id(message, m, espagnolCpi2)
        remove_role_by_id(message, m, allemandIatic3)
        remove_role_by_id(message, m, espagnolIatic3)
        remove_role_by_id(message, m, chinoisIatic3)
        remove_role_by_id(message, m, allemandIatic4)
        remove_role_by_id(message, m, espagnolIatic4)
        remove_role_by_id(message, m, chinoisIatic4)
        remove_role_by_name(message, m, 'Étudiant')
    })

    allemandCpi2 = allemandCpi2Tmp
    espagnolCpi2 = espagnolCpi2Tmp
    allemandIatic3 = allemandIatic3Tmp
    espagnolIatic3 = espagnolIatic3Tmp
    chinoisIatic3 = chinoisIatic3Tmp
    allemandIatic4 = allemandIatic4Tmp
    espagnolIatic4 = espagnolIatic4Tmp
    chinoisIatic4 = chinoisIatic4Tmp

    return true
}

async function create_role(message, name, color) {
    let role
    await message.guild.roles
        .create()
        .then((r) => {
            role = r
        })
        .then(() => role.setColor(color))
        .then(() => role.setName(name))
        .then(() => role.setHoist(true))
        .then(() => role.setMentionable(true))
    return role.id
}

async function delete_role_by_name(message, name) {
    let role = await message.guild.roles.cache.find((r) => r.name === name)
    if (role != undefined) {
        await role.delete()
    }
}

async function delete_role_by_id(message, id) {
    let role = await message.guild.roles.cache.find((r) => r.id === id)
    if (role != undefined) {
        await role.delete()
    }
}

async function get_roles_color(message) {
    let color = []
    color.push(await get_role_color(message, 'CPI 1'))
    color.push(await get_role_color(message, 'CPI 2'))
    color.push(await get_role_color(message, 'MT 3'))
    color.push(await get_role_color(message, 'MT 4'))
    color.push(await get_role_color(message, 'MT 5'))
    color.push(await get_role_color(message, 'IATIC 3'))
    color.push(await get_role_color(message, 'IATIC 4'))
    color.push(await get_role_color(message, 'IATIC 5'))
    color.push(await get_role_color(message, 'SEE 3'))
    color.push(await get_role_color(message, 'SEE 4'))
    color.push(await get_role_color(message, 'SEE 5'))
    color.push(await get_role_color(message, 'SNPI 3'))
    color.push(await get_role_color(message, 'SNPI 4'))
    color.push(await get_role_color(message, 'SNPI 5'))
    color.push(await get_role_color(message, 'M1 CHPS'))
    color.push(await get_role_color(message, 'M2 CHPS'))
    color.push(await get_role_color(message, 'M1 IRS'))
    color.push(await get_role_color(message, 'M2 IRS'))
    return color
}

async function get_roles(message) {
    let roleEtu = []
    roleEtu.push(
        await message.guild.roles.cache.find((r) => r.name === 'CPI 1')
    )
    roleEtu.push(
        await message.guild.roles.cache.find((r) => r.name === 'CPI 2')
    )
    roleEtu.push(await message.guild.roles.cache.find((r) => r.name === 'MT 3'))
    roleEtu.push(await message.guild.roles.cache.find((r) => r.name === 'MT 4'))
    roleEtu.push(await message.guild.roles.cache.find((r) => r.name === 'MT 5'))
    roleEtu.push(
        await message.guild.roles.cache.find((r) => r.name === 'IATIC 3')
    )
    roleEtu.push(
        await message.guild.roles.cache.find((r) => r.name === 'IATIC 4')
    )
    roleEtu.push(
        await message.guild.roles.cache.find((r) => r.name === 'IATIC 5')
    )
    roleEtu.push(
        await message.guild.roles.cache.find((r) => r.name === 'SEE 3')
    )
    roleEtu.push(
        await message.guild.roles.cache.find((r) => r.name === 'SEE 4')
    )
    roleEtu.push(
        await message.guild.roles.cache.find((r) => r.name === 'SEE 5')
    )
    roleEtu.push(
        await message.guild.roles.cache.find((r) => r.name === 'SNPI 3')
    )
    roleEtu.push(
        await message.guild.roles.cache.find((r) => r.name === 'SNPI 4')
    )
    roleEtu.push(
        await message.guild.roles.cache.find((r) => r.name === 'SNPI 5')
    )
    roleEtu.push(
        await message.guild.roles.cache.find((r) => r.name === 'M1 CHPS')
    )
    roleEtu.push(
        await message.guild.roles.cache.find((r) => r.name === 'M2 CHPS')
    )
    roleEtu.push(
        await message.guild.roles.cache.find((r) => r.name === 'M1 IRS')
    )
    roleEtu.push(
        await message.guild.roles.cache.find((r) => r.name === 'M2 IRS')
    )
    return roleEtu
}

async function change_all_roles(message) {
    let color = await get_roles_color(message)

    await delete_role_by_name(message, 'CPI 2')
    await delete_role_by_id(message, allemandCpi2)
    await delete_role_by_id(message, espagnolCpi2)
    await delete_role_by_name(message, 'MT 5')
    await delete_role_by_name(message, 'IATIC 5')
    await delete_role_by_name(message, 'SEE 5')
    await delete_role_by_name(message, 'SNPI 5')
    await delete_role_by_name(message, 'M2 CHPS')
    await delete_role_by_name(message, 'M2 IRS')
    await delete_role_by_id(message, allemandIatic4)
    await delete_role_by_id(message, espagnolIatic4)
    await delete_role_by_id(message, chinoisIatic4)

    await change_role_name(message, 'CPI 1', 'CPI 2', color[Etudiants.CPI2])
    await change_role_name(message, 'MT 4', 'MT 5', color[Etudiants.MT5])
    await change_role_name(message, 'MT 3', 'MT 4', color[Etudiants.MT4])
    await change_role_name(
        message,
        'IATIC 4',
        'IATIC 5',
        color[Etudiants.IATIC5]
    )
    await change_role_name(
        message,
        'IATIC 3',
        'IATIC 4',
        color[Etudiants.IATIC4]
    )
    allemandIatic4Tmp = allemandIatic3
    espagnolIatic4Tmp = espagnolIatic3
    chinoisIatic4Tmp = chinoisIatic3
    await change_role_name(message, 'SEE 4', 'SEE 5', color[Etudiants.SEE5])
    await change_role_name(message, 'SEE 3', 'SEE 4', color[Etudiants.SEE4])
    await change_role_name(message, 'SNPI 4', 'SNPI 5', color[Etudiants.SNPI5])
    await change_role_name(message, 'SNPI 3', 'SNPI 4', color[Etudiants.SNPI4])
    await change_role_name(
        message,
        'M1 CHPS',
        'M2 CHPS',
        color[Etudiants.M2CHPS]
    )
    await change_role_name(message, 'M1 IRS', 'M2 IRS', color[Etudiants.M2IRS])

    allemandCpi2Tmp = await create_role(message, 'Allemand', 0)
    espagnolCpi2Tmp = await create_role(message, 'Espagnol', 0)
    await create_role(message, 'CPI 1', color[Etudiants.CPI1])
    await create_role(message, 'MT 3', color[Etudiants.MT3])
    await create_role(message, 'IATIC 3', color[Etudiants.IATIC3])
    allemandIatic3Tmp = await create_role(message, 'Allemand', 0)
    espagnolIatic3Tmp = await create_role(message, 'Espagnol', 0)
    chinoisIatic3Tmp = await create_role(message, 'Chinois', 0)
    await create_role(message, 'SEE 3', color[Etudiants.SEE3])
    await create_role(message, 'SNPI 3', color[Etudiants.SNPI3])
    await create_role(message, 'M1 CHPS', color[Etudiants.M1CHPS])
    await create_role(message, 'M1 IRS', color[Etudiants.M1IRS])

    console.log('allemandCpi2 : ' + allemandCpi2Tmp)
    console.log('espagnolCpi2 : ' + espagnolCpi2Tmp)
    console.log('allemandIatic3 : ' + allemandIatic3Tmp)
    console.log('espagnolIatic3 : ' + espagnolIatic3Tmp)
    console.log('chinoisIatic3 : ' + chinoisIatic3Tmp)
    console.log('allemandIatic4 : ' + allemandIatic4Tmp)
    console.log('espagnolIatic4 : ' + espagnolIatic4Tmp)
    console.log('chinoisIatic4 : ' + chinoisIatic4Tmp)

    return true
}

async function change_all_categories(message) {
    await delete_category(message, 'CPI 2')
    await delete_category(message, 'MT 5')
    await delete_category(message, 'IATIC 5')
    await delete_category(message, 'SEE 5')
    await delete_category(message, 'SNPI 5')
    await delete_category(message, 'M2 CHPS')
    await delete_category(message, 'M2 IRS')

    let roleEve = await message.guild.roles.everyone
    let roleModo = await message.guild.roles.cache.find(
        (r) => r.name === 'Modo'
    )
    let roleMono = await message.guild.roles.cache.find(
        (r) => r.name === 'Monocle de Vérité'
    )
    let roleEtu = await get_roles(message)

    await change_category_name(message, 'CPI 1', 'CPI 2')
    await change_category_name(message, 'MT 4', 'MT 5')
    await change_category_name(message, 'MT 3', 'MT 4')
    await change_category_name(message, 'IATIC 4', 'IATIC 5')
    await change_category_name(message, 'IATIC 3', 'IATIC 4')
    await change_category_name(message, 'SEE 4', 'SEE 5')
    await change_category_name(message, 'SEE 3', 'SEE 4')
    await change_category_name(message, 'SNPI 4', 'SNPI 5')
    await change_category_name(message, 'SNPI 3', 'SNPI 4')
    await change_category_name(message, 'M1 CHPS', 'M2 CHPS')
    await change_category_name(message, 'M1 IRS', 'M2 IRS')

    delete_channel_in_category(message, '『🇪🇸』espagnol', 'IATIC 5')
    delete_channel_in_category(message, '『🇩🇪』allemand', 'IATIC 5')
    delete_channel_in_category(message, '『🇨🇳』chinois', 'IATIC 5')
    let cpi2Category = await message.guild.channels.cache.find(
        (c) => c.name === 'CPI 2' && c.type === 'category'
    )
    let allemandCpi2Role = await message.guild.roles.cache.find(
        (r) => r.id === allemandCpi2
    )
    let espagnolCpi2Role = await message.guild.roles.cache.find(
        (r) => r.id === espagnolCpi2
    )
    if (cpi2Category != undefined) {
        if (allemandCpi2Role != undefined)
            create_lang_channel(
                message,
                roleEve,
                roleModo,
                roleMono,
                roleEtu[Etudiants.CPI2],
                '『🇩🇪』allemand',
                cpi2Category,
                3,
                allemandCpi2Role
            )
        if (espagnolCpi2Role != undefined)
            create_lang_channel(
                message,
                roleEve,
                roleModo,
                roleMono,
                roleEtu[Etudiants.CPI2],
                '『🇪🇸』espagnol',
                cpi2Category,
                4,
                espagnolCpi2Role
            )
    }

    create_complet_category(
        message,
        roleEve,
        roleModo,
        roleMono,
        roleEtu[Etudiants.CPI1],
        'CPI 1'
    )
    create_complet_category(
        message,
        roleEve,
        roleModo,
        roleMono,
        roleEtu[Etudiants.MT3],
        'MT 3'
    )
    create_complet_category(
        message,
        roleEve,
        roleModo,
        roleMono,
        roleEtu[Etudiants.IATIC3],
        'IATIC 3'
    )
    create_complet_category(
        message,
        roleEve,
        roleModo,
        roleMono,
        roleEtu[Etudiants.SEE3],
        'SEE 3'
    )
    create_complet_category(
        message,
        roleEve,
        roleModo,
        roleMono,
        roleEtu[Etudiants.SNPI3],
        'SNPI 3'
    )
    create_complet_category(
        message,
        roleEve,
        roleModo,
        roleMono,
        roleEtu[Etudiants.M1CHPS],
        'M1 CHPS'
    )
    create_complet_category(
        message,
        roleEve,
        roleModo,
        roleMono,
        roleEtu[Etudiants.M1IRS],
        'M1 IRS'
    )

    return true
}

async function resetpromo(message) {
    if (
        !message.member.roles.cache
            .filter((r) => r.id !== message.guild.id)
            .find((r) => r.name === 'Gérant du serv')
    ) {
        return message
            .reply("non t'as pas le droit toi")
            .then((m) => m.delete({ timeout: 5000 }))
    }

    console.log('Début du reset')

    console.log('Changement des rôles : ' + (await change_all_roles(message)))

    console.log('Reset des rôles : ' + reset_etu_role(message))

    // console.log("Changement des catégories : " + await change_all_categories(message));

    console.log("C'est bon !")
}
