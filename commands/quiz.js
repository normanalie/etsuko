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
const { inThread } = require('../misc/inThread')

async function getQuiz(category) {
    const apiResponse = await axios.get(
        `https://quizzapi.jomoreschi.fr/api/v1/quiz?limit=1&category=${category}`
    )
    const data = apiResponse.data.quizzes[0]
    const formated_data = {
        question: data.question,
        answer: data.answer,
        answers: data.badAnswers,
        category: data.category,
        difficulty: data.difficulty,
    }
    formated_data.answers.push(formated_data.answer)
    formated_data.answers = shuffleArray(formated_data.answers)
    return formated_data
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
            `Catégorie: ${data.category} - Difficulté: ${data.difficulty}`
        )
    return {
        embeds: [embed],
        components: [buildButtons(data.answers), buildEndButton()],
    }
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
        .addFields({ name: '\u200B', value: '\u200B' })
        .setFooter({
            text: 'Quiz fourni par [https://quizzapi.jomoreschi.fr/](https://quizzapi.jomoreschi.fr/)',
            iconURL:
                'https://avatars.githubusercontent.com/u/88693358?s=48&v=4',
        })
    message.embeds = [embed]
    message.components = [
        disableButtons(message, quiz.answer),
        buildEndButton(),
    ]
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
        .addFields({ name: '\u200B', value: '\u200B' })
        .setFooter({
            text: 'Quiz fourni par https://quizzapi.jomoreschi.fr/',
            iconURL:
                'https://avatars.githubusercontent.com/u/88693358?s=48&v=4',
        })
    message.embeds = [embed]
    message.components = [
        disableButtons(message, quiz.answer),
        buildEndButton(),
    ]
    return message
}

function buildEndButton() {
    const row = new ActionRowBuilder()
    const endButton = new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setLabel('Terminer')
        .setCustomId('end')
    row.addComponents(endButton)
    return row
}

async function gameLoop(interaction, thread) {
    while (1) {
        const quiz = await getQuiz(
            interaction.options.getString('category') ?? ''
        )
        const questionMessage = await thread.send(buildQuestionMessage(quiz))
        try {
            const answer = await questionMessage.awaitMessageComponent({
                time: 120000,
            })
        } catch (e) {
            console.log('[COMMAND] - Quiz: User interaction to answer timeout.')
            return
        }

        if (answer.customId == 'end') {
            return
        } else if (answer.customId == quiz.answer) {
            answer.update(buildCorrectMessage(quiz, answer.user))
        } else {
            answer.update(buildWrongMessage(quiz, answer.user))
        }
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quiz')
        .setDescription(
            'Trouverez vous la réponse ?\u200BVous pouvez ajouter des questions sur https://quizzapi.jomoreschi.fr/'
        )
        .addStringOption((option) =>
            option
                .setName('category')
                .setDescription('La catégories des questions')
                .setRequired(false)
                .addChoices(
                    { name: 'TV/Cinéma', value: 'tv_cinema' },
                    { name: 'Art/Littérature', value: 'art_litterature' },
                    { name: 'Musique', value: 'musique' },
                    { name: 'Actu', value: 'actu_politique' },
                    { name: 'Culture Générale', value: 'culture_generale' },
                    { name: 'Sport', value: 'sport' },
                    { name: 'Jeux Vidéos', value: 'jeux_videos' }
                )
        ),
    async execute(interaction) {
        try {
            await interaction.deferReply({ fetchReply: true })
            if (inThread(interaction)) {
                console.log(
                    '[COMMAND] - Quiz: Try to create a thread in a thread.'
                )
                interaction.deleteReply()
                return
            }
            const thread = await interaction.channel.threads.create({
                name: `Quiz de ${interaction.user.username}`,
                autoArchiveDuration: 60,
            })
            interaction.deleteReply()
            await gameLoop(interaction, thread)
            thread.delete()
        } catch (error) {
            console.error(error)
        }
    },
}
