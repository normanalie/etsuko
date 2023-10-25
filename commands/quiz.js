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

const quizCategories = [
    { name: 'TV/Cinéma', value: 'tv_cinema' },
    { name: 'Art/Littérature', value: 'art_litterature' },
    { name: 'Musique', value: 'musique' },
    { name: 'Actu', value: 'actu_politique' },
    { name: 'Culture Générale', value: 'culture_generale' },
    { name: 'Sport', value: 'sport' },
    { name: 'Jeux Vidéos', value: 'jeux_videos' },
]

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
                .addChoices(...quizCategories)
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

async function gameLoop(interaction, thread) {
    let scores = {}
    while (1) {
        const quiz = await getQuiz(
            interaction.options.getString('category') ?? ''
        )
        const questionMessage = await thread.send(buildQuestionMessage(quiz))
        try {
            const answer = await questionMessage.awaitMessageComponent({
                time: 120000,
            })
            if (answer.customId == 'end') {
                return
            } else if (answer.customId == quiz.answer) {
                scores = incrementScores(scores, answer.user.username)
                answer.update(buildCorrectMessage(quiz, answer.user, scores))
            } else {
                if (!(answer.user.username in scores)) {
                    scores[answer.user.username] = 0
                }
                answer.update(
                    buildWrongMessage(
                        quiz,
                        answer.user,
                        answer.customId,
                        scores
                    )
                )
            }
        } catch (e) {
            console.error('[COMMAND] - Quiz: Error in game loop.')
            console.error(e)
            return
        }
    }
}

function incrementScores(scores, username) {
    if (isNaN((scores[username] += 1))) {
        scores[username] = 1
    }
    return scores
}

function formatScores(scores) {
    let string = ''
    Object.entries(scores).forEach((entry) => {
        const [username, score] = entry
        string += `${username}: ${score}\n`
    })
    return string
}

function getCategoryNameByValue(value) {
    return (
        quizCategories.find((category) => category.value === value)?.name ||
        null
    )
}

async function getQuiz(category) {
    const apiResponse = await axios.get(
        `https://quizzapi.jomoreschi.fr/api/v1/quiz?limit=1&category=${category}`
    )
    const data = apiResponse.data.quizzes[0]
    const formated_data = {
        id: data._id,
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
            `Catégorie: ${getCategoryNameByValue(
                data.category
            )} - Difficulté: ${data.difficulty}`
        )
        .setFooter({
            text: `Quiz fourni par https://quizzapi.jomoreschi.fr/  -  ID: ${data.id}`,
            iconURL:
                'https://avatars.githubusercontent.com/u/88693358?s=48&v=4',
        })
        .setURL('https://quizzapi.jomoreschi.fr/')
    return {
        embeds: [embed],
        components: [buildButtons(data.answers), buildEndButton()],
    }
}

function disableButtons(message, correct_answer, user_answer) {
    const row = new ActionRowBuilder()
    const buttons = message.components[0].components
    buttons.forEach((button) => {
        button.setStyle(ButtonStyle.Secondary)
        if (button.data.custom_id == correct_answer) {
            button.setStyle(ButtonStyle.Success)
        }
        if (
            button.data.custom_id == user_answer &&
            correct_answer != user_answer
        ) {
            button.setStyle(ButtonStyle.Danger)
        }
        button.setDisabled(true)
        row.addComponents(button)
    })
    return row
}

function buildCorrectMessage(quiz, user, scores) {
    const message = buildQuestionMessage(quiz)
    const embed = EmbedBuilder.from(message.embeds[0])
        .setColor(Colors.Green)
        .addFields({ name: '\u200B', value: '\u200B' })
        .addFields({
            name: `Bonne réponse !`,
            value: `Bravo ${user}`,
        })
        .addFields({
            name: `Scores`,
            value: `${formatScores(scores)}`,
        })
        .addFields({ name: '\u200B', value: '\u200B' })
        .setFooter({
            text: `Quiz fourni par https://quizzapi.jomoreschi.fr/  -  ID: ${quiz.id}`,
            iconURL:
                'https://avatars.githubusercontent.com/u/88693358?s=48&v=4',
        })
        .setURL('https://quizzapi.jomoreschi.fr/')
    message.embeds = [embed]
    message.components = [disableButtons(message, quiz.answer, quiz.answer)]
    return message
}

function buildWrongMessage(quiz, user, user_answer, scores) {
    const message = buildQuestionMessage(quiz)
    const embed = EmbedBuilder.from(message.embeds[0])
        .setColor(Colors.Red)
        .addFields({ name: '\u200B', value: '\u200B' })
        .addFields({
            name: `Mauvaise réponse.`,
            value: `Dommage ${user}`,
        })
        .addFields({
            name: `Scores`,
            value: `${formatScores(scores)}`,
        })
        .addFields({ name: '\u200B', value: '\u200B' })
        .setFooter({
            text: `Quiz fourni par https://quizzapi.jomoreschi.fr/  -  ID: ${quiz.id}`,
            iconURL:
                'https://avatars.githubusercontent.com/u/88693358?s=48&v=4',
        })
        .setURL('https://quizzapi.jomoreschi.fr/')
    message.embeds = [embed]
    message.components = [disableButtons(message, quiz.answer, user_answer)]
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
