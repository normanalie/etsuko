const { getTrackedMessage } = require('../misc/trackedMessages')
const {
    ActionRowBuilder,
    EmbedBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ComponentType,
} = require('discord.js')

async function handleWelcome(client) {
    const welcomeMessage = await getTrackedMessage(client, 'welcome')

    const collector = welcomeMessage.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        time: 3_600_000,
    })

    collector.on('collect', async (i) => {
        const selection = i.values[0]
        await i.reply(`${i.user} has selected ${selection}!`)
    })
}

async function newMemberWelcome(member) {
    const channel = member.guild.systemChannel
    if (!channel) return

    const embed = new EmbedBuilder()
        .setAuthor({
            name: 'Etsuko',
            url: 'https://github.com/normanalie/etsuko',
        })
        .setTitle(`Bienvenue ${member.displayName} sur le serveur.`)
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

    const programSelect = new StringSelectMenuBuilder()
        .setCustomId('program')
        .setPlaceholder('Votre filière ?')
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('CPI1')
                .setValue('cpi1'),
            new StringSelectMenuOptionBuilder()
                .setLabel('CPI2')
                .setValue('cpi2'),
            new StringSelectMenuOptionBuilder()
                .setLabel('IATIC3')
                .setValue('iatic3'),
            new StringSelectMenuOptionBuilder()
                .setLabel('IATIC4')
                .setValue('iatic4'),
            new StringSelectMenuOptionBuilder()
                .setLabel('IATIC5')
                .setValue('iatic5')
        )
    const row = new ActionRowBuilder().addComponents(programSelect)

    const response = await channel.send({
        embeds: [embed],
        components: [row],
    })
}

exports.newMemberWelcome = newMemberWelcome
exports.handleWelcome = handleWelcome
