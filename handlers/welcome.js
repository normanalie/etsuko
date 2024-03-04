const {
    getTrackedMessage,
    getPrograms,
    setTrackedMessage,
    getRole,
} = require('../misc/database')
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
    setCollector(welcomeMessage)
}

let currentCollector = null
function setCollector(welcomeMessage) {
    if (currentCollector) {
        console.log('Stopped collector')
        currentCollector.stop()
    }
    const collector = welcomeMessage.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        time: 3_600_000,
    })

    collector.on('collect', async (i) => {
        try {
            const selection = i.values[0]
            const role = await getRole(selection)
            if (role) {
                await i.member.roles.add(role.roleid)
                await i.reply({
                    content: `Vous avez désormais le rôle ${role.name} !`,
                    ephemeral: true,
                })
                if (role.isStudent) {
                    const studentRole = await getRole('student')
                    if (studentRole) {
                        await i.member.roles.add(studentRole.roleid)
                        await i.followUp({
                            content: `Vous avez également le rôle étudiant.`,
                            ephemeral: true,
                        })
                    } else {
                        await i.followUp({
                            content: `Le rôle "student" n'a pas été trouvé.`,
                            ephemeral: true,
                        })
                    }
                }
            } else {
                await i.reply({
                    content: `Le rôle ${selection} n'a pas été trouvé.`,
                    ephemeral: true,
                })
            }
        } catch (error) {
            console.error(
                'Erreur lors de la collecte du composant de message :',
                error
            )
            await i.followUp({
                content:
                    "Une erreur s'est produite lors de la sélection du rôle.",
                ephemeral: true,
            })
        }
    })

    currentCollector = collector
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

function buildEmbed() {
    const embed = new EmbedBuilder()
        .setAuthor({
            name: 'Etsuko',
            url: 'https://github.com/normanalie/etsuko',
        })
        .setTitle('🚀 Bienvenue sur le serveur **__Tous les ISTY__**')
        .setDescription(
            "Ce lieu d'échange est dédié à tous les membres de l'ISTY. \nConnectez-vous pour découvrir des espaces uniques : échangez avec vos camarades de promo, dialoguez directement avec vos professeurs, discutez avec d'autres étudiants de votre filière, et créez des liens avec l'ensemble de la communauté ISTY, alignés sur vos passions communes.\n\n."
        )
        .addFields(
            {
                name: '✅ **Quelques règles à respecter**',
                value: "1. **Respect et courtoisie** : Respectez toujours les autres membres du serveur et soyez courtois dans vos interactions.\n2. **Contenu approprié** : Assurez-vous que tout contenu partagé sur le serveur est approprié pour un environnement scolaire et professionnel.\n3. **Langage respectueux** : Utilisez un langage respectueux en tout temps, évitez les jurons et les discours offensants.\n4. **Collaboration** : Encouragez la collaboration et le partage d'idées entre les membres du serveur.\n5. **Pas de spam** : Évitez de spammer les canaux avec des messages inutiles ou répétitifs.\n6. **Respect de la vie privée** : Respectez la vie privée des autres membres en ne partageant pas d'informations personnelles sans leur consentement.\n7. **Modération** : Respectez les décisions des modérateurs et des administrateurs du serveur, et suivez leurs instructions en cas de besoin.\n8. **Signalement** : Signalez tout comportement inapproprié ou toute violation des règles aux modérateurs pour une action appropriée.\n\n.",
                inline: false,
            },
            {
                name: '☎️ **Les contacts**',
                value: 'Ce serveur est administré par <@638094645670182932>\nLa modération est assurée par:\n- <@279258207267061760>\n- <@333544742354812928>\n- <@97035275686907904>\n- <@394458641358520320>\n- <@290231852755582978>\n- <@240142431570362368>\n- <@272788035383459840>\n- <@125591910982090752>\n- <@282091856530112522>\nLe bot est géré par <@775757989965070387>\n\n.',
                inline: false,
            },
            {
                name: '📝 **Les rôles**',
                value: "Pour accéder au serveur, complète le formulaire ci-dessous et le bot t'attribuera tes rôles automatiquement.\n",
                inline: false,
            }
        )
        .setColor('#ff9300')
    return embed
}

async function sendWelcomeMessage(channel) {
    if (!channel) return

    const embed = buildEmbed()

    const row = await buildActionRow()

    const message = await channel.send({
        embeds: [embed],
        components: [row],
    })
    await setTrackedMessage('welcome', message.channelId, message.id)
    setCollector(message)
}

exports.sendWelcomeMessage = sendWelcomeMessage
exports.handleWelcome = handleWelcome
