const { getTrackedMessage, getPrograms } = require('../misc/database')
const {
    ActionRowBuilder,
    EmbedBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ComponentType,
} = require('discord.js')

async function handleWelcome(client) {
    const welcomeMessage = await getTrackedMessage(client, 'welcome')
    if (welcomeMessage == null) {
        console.log('No welcome message. Please use /initWelcome')
        return
    }

    const collector = welcomeMessage.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        time: 3_600_000,
    })

    collector.on('collect', async (i) => {
        const selection = i.values[0]
        await i.reply(`${i.user} has selected ${selection}!`)
    })
}

async function buildActionRow() {
    const programs = await getPrograms()
    const programSelect = new StringSelectMenuBuilder()
        .setCustomId('program')
        .setPlaceholder('Votre filière ?')
    programs.forEach((program) => {
        const optionBuilder = new StringSelectMenuOptionBuilder()
            .setLabel(program.displayname)
            .setValue(program.name)

        if (program.desc !== null && program.desc.length >= 1) {
            optionBuilder.setDescription(program.desc)
        }

        programSelect.addOptions(optionBuilder)
    })
    return new ActionRowBuilder().addComponents(programSelect)
}

async function sendWelcomeMessage(channel) {
    if (!channel) return

    const embed = new EmbedBuilder()
        .setAuthor({
            name: 'Etsuko',
            url: 'https://github.com/normanalie/etsuko',
        })
        .setTitle(`Bienvenue sur le serveur **Tous les ISTY**`)
        .setDescription('Blablabla')
        .addFields(
            {
                name: 'Les règles du serveur',
                value: 'Lorem ipsum dolor sit Jamet',
                inline: false,
            },
            {
                name: 'Quelques renseignements',
                value: "Le bot va t'attribuer automatiquement les rôles.",
                inline: false,
            }
        )
        .setColor('#d58800')

    const row = await buildActionRow()

    channel.send({
        embeds: [embed],
        components: [row],
    })
}

exports.sendWelcomeMessage = sendWelcomeMessage
exports.handleWelcome = handleWelcome
