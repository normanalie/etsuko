const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    Colors,
} = require('discord.js')
const axios = require('axios')
const { shuffleArray } = require('../misc/shuffleArray')

async function getQuiz() {
    const apiResponse = await axios.get(
        'https://api.openquizzdb.org/?key=4673C3S8Q8&choice=4&anec=1'
    )
    const data = apiResponse.data.results[0]
    data.autres_choix = shuffleArray(data.autres_choix)
    return data
}

function buildButtons(choices) {
    const row = new ActionRowBuilder()
    choices.forEach((choice) => {
        const resButton = new ButtonBuilder()
            .setCustomId(choice)
            .setLabel(choice)
            .setStyle(ButtonStyle.Primary)
        row.addComponents(resButton)
    })
    return row
}

function buildQuestionMessage(data) {
    const embed = new EmbedBuilder()
        .setColor(0x418dc8)
        .setTitle(data.question)
        .setDescription(
            `Catégorie: ${data.categorie} - Difficulté: ${data.difficulte}`
        )
    return { embeds: [embed], components: [buildButtons(data.autres_choix)] }
}

function disableButtons(message, correct_answer) {
    const row = new ActionRowBuilder()
    const buttons = message.components[0].components
    buttons.forEach((button) => {
        if (button.data.custom_id == correct_answer) {
            button.setStyle(ButtonStyle.Success)
        } else {
            button.setStyle(ButtonStyle.Secondary)
        }
        button.setDisabled(true)
        row.addComponents(button)
    })
    return row
}

function buildCorrectMessage(quiz, user) {
    const message = buildQuestionMessage(quiz)
    const embed = EmbedBuilder.from(message.embeds[0])
        .setColor(Colors.Green)
        .addFields({ name: '\u200B', value: '\u200B' })
        .addFields({
            name: `Bonne réponse !`,
            value: `Bravo ${user}`,
        })
        .addFields({
            name: 'Anecdote',
            value: quiz.anecdote,
        })
        .addFields({ name: '\u200B', value: '\u200B' })
    message.embeds = [embed]
    message.components = [disableButtons(message, quiz.reponse_correcte)]
    return message
}

function buildWrongMessage(quiz, user) {
    const message = buildQuestionMessage(quiz)
    const embed = EmbedBuilder.from(message.embeds[0])
        .setColor(Colors.Red)
        .addFields({ name: '\u200B', value: '\u200B' })
        .addFields({
            name: `Mauvaise réponse.`,
            value: `Dommage ${user}`,
        })
        .addFields({
            name: 'Anecdote',
            value: quiz.anecdote,
        })
        .addFields({ name: '\u200B', value: '\u200B' })
    message.embeds = [embed]
    message.components = [disableButtons(message, quiz.reponse_correcte)]
    return message
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quiz')
        .setDescription('Trouverez vous la réponse ?'),
    async execute(interaction) {
        try {
            await interaction.deferReply({ fetchReply: true })
            const quiz = await getQuiz()
            const questionMessage = await interaction.editReply(
                buildQuestionMessage(quiz)
            )
            const answer = await questionMessage.awaitMessageComponent({
                time: 60000,
            })
            if (answer.customId == quiz.reponse_correcte) {
                answer.update(buildCorrectMessage(quiz, answer.user))
            } else {
                answer.update(buildWrongMessage(quiz, answer.user))
            }
        } catch (error) {
            console.error(error)
        }
    },
}
