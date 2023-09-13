const {
    Client,
    Collection,
    GatewayIntentBits,
    Partials,
    Events,
} = require('discord.js')
const { collectSlashCommands } = require('./handlers/commands')
const path = require('path')
require('dotenv').config()

const client = new Client({
    disableEveryone: true,
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.Reaction,
        Partials.User,
        Partials.GuildMember,
    ],
    intents: [
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
    ],
})

client.commands = collectSlashCommands(path.join(__dirname, 'commands'))

client.login(process.env.TOKEN)

module.exports = client
