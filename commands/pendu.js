const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { compareArrays } = require('../functions.js')
const { dictionaire } = require('../asset/db_word.js')
const { randomInt } = require('../misc/randomInt.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pendu')
        .setDescription('Lance une partie de pendu')
        .addStringOption((option) =>
            option
                .setName('prompt')
                .setDescription('Ton mot ou ta phrase pour le pendu')
                .setRequired(false)
        ),
    async execute(interaction) {
        // Send message to inform that the command is starting
        try {
            interaction.deferReply({ fetchReply: true })
        } catch (error) {
            console.error(error)
        }

        // Get the prompt for the game
        let toFind = interaction.options.getString('prompt')

        // easter egg
        if (toFind == 'bob') toFind = dictionaire[toFind]

        // if not word option
        if (!toFind) toFind = getRandomWord()

        let thread

        // Try to create a thread for the current game
        try {
            if (!interaction.channel.threads) {
                try {
                    await interaction.deleteReply()
                    console.log('[COMMANDS] - Pendu: No thread.')
                } catch (error) {
                    console.error(error)
                }
                return
            }
            thread = await interaction.channel.threads.create({
                name: `Pendu de ${interaction.member.displayName} (en cours)`,
                autoArchiveDuration: 60,
            })
        } catch (error) {
            console.error(error)
            console.error('[COMMANDS] - Pendu: Error during thread creation.')
            try {
                await interaction.deleteReply()
            } catch (error) {
                console.error(error)
            }
            return
        }

        try {
            await interaction.deleteReply()
        } catch (error) {
            console.error(error)
        }

        // Set the variables for the game
        let toFindArray = toFind.split('')
        let displayedArray = discoverLetter(
            toFindArray,
            initDisplayArray(toFindArray),
            toFindArray[0]
        )
        let usedItems = { letters: [toFindArray[0]], words: [] }

        // The first message in the thread
        let embed = new EmbedBuilder()
            .setColor('Green')
            .setTitle(
                `Jeu du pendu lancé par ${interaction.member.displayName}`
            )
            .addFields(
                {
                    name: 'Mot à trouver',
                    value: displayedArray.join(' '),
                    inline: false,
                },
                {
                    name: 'Attention',
                    value: `Lettres utilisées : ${usedItems.letters.join(
                        ', '
                    )}\nMots proposés : ${usedItems.words.join(', ')}`,
                    inline: false,
                }
            )
            .setImage(
                'https://media.discordapp.net/attachments/1063188671995596873/1063188684586893372/uploads.png'
            )

        // Start the game
        try {
            thread.send({ embeds: [embed] }).then((message) => {
                game(message, toFindArray, displayedArray, usedItems, 0, embed)
            })
        } catch (error) {
            console.error(error)
            console.error(
                "[COMMANDS] - Pendu: Can't send message in the thread."
            )
        }
    },
}

// return a random word of a random size (Hard mode)
function getRandomWord() {
    let word_size = randomInt(3, 13)
    let nb_word = dictionaire[String(word_size)].length

    return dictionaire[String(word_size)][randomInt(0, nb_word)].toUpperCase()
}

// Returns an array representing the start of the game
function initDisplayArray(toFindArray) {
    let displayedArray = []

    for (let i = 0; i < toFindArray.length; i++) {
        if (toFindArray[i].match(/[a-z]/i)) {
            displayedArray.push('█')
        } else if (toFindArray[i] === ' ') {
            toFindArray[i] = ' '
            displayedArray.push(' ')
        } else {
            displayedArray.push(toFindArray[i])
        }
    }

    return displayedArray
}

// Try to discover letters to update the 'displayArray' array
function discoverLetter(toFindArray, displayedArray, letter) {
    let upperCase = false
    if (letter === letter.toUpperCase()) upperCase = true

    for (let i = 0; i < toFindArray.length; i++) {
        if (toFindArray[i] === letter) {
            displayedArray[i] = letter
        } else if (upperCase) {
            if (toFindArray[i] === letter.toLowerCase())
                displayedArray[i] = letter.toLowerCase()
        } else if (!upperCase) {
            if (toFindArray[i] === letter.toUpperCase())
                displayedArray[i] = letter.toUpperCase()
        }
    }

    return displayedArray
}

// Check if the letter is in the prompt
function isLetterInWord(toFindArray, letter) {
    for (let i = 0; i < toFindArray.length; i++) {
        if (toFindArray[i].toLowerCase() === letter.toLowerCase()) return true
    }
    return false
}

// Update the message depending on the current state of the game (color, image, used words or letters and current display of the prompt)
function updateEmbed(embed, failCounter, displayedArray, usedItems) {
    let colors = [
        '#57f288',
        '#6cd97e',
        '#82c075',
        '#97a76b',
        '#ad8d62',
        '#c27458',
        '#d85b4f',
        '#ed4245',
    ]

    let images = [
        'https://media.discordapp.net/attachments/1063188671995596873/1063188684586893372/uploads.png',
        'https://media.discordapp.net/attachments/1063188671995596873/1063188791084449792/uploads.png',
        'https://media.discordapp.net/attachments/1063188671995596873/1063188819475709952/uploads.png',
        'https://media.discordapp.net/attachments/1063188671995596873/1063188849657921577/uploads.png',
        'https://media.discordapp.net/attachments/1063188671995596873/1063188878460211261/uploads.png',
        'https://media.discordapp.net/attachments/1063188671995596873/1063188908436901988/uploads.png',
        'https://media.discordapp.net/attachments/1063188671995596873/1063188934605148272/uploads.png',
        'https://media.discordapp.net/attachments/1063188671995596873/1063188965613645964/uploads.png',
    ]

    embed
        .setColor(colors[failCounter])
        .setFields(
            {
                name: 'Mot à trouver',
                value: displayedArray.join(' '),
                inline: false,
            },
            {
                name: 'Attention',
                value: `Lettres utilisées : ${usedItems.letters.join(
                    ', '
                )}\nMots proposés : ${usedItems.words.join(', ')}`,
                inline: false,
            }
        )
        .setImage(images[failCounter])

    return embed
}

// Main function
async function game(
    message,
    toFindArray,
    displayedArray,
    usedItems,
    failCounter,
    embed
) {
    let filter = () => true
    let isWin = false
    let isFail = false

    // Create a collector in the thread to collect the next message from a user
    let collector
    try {
        collector = message.channel.createMessageCollector({
            filter,
            max: 1,
            time: 300000,
            errors: ['time'],
        })
    } catch (error) {
        console.error(error)
        console.error(
            "[COMMANDS] - Pendu: Can't create a thread's messages collector."
        )
        return
    }

    // When triggered
    collector.on('collect', async (m) => {
        let input = m.content

        // Check if the message if a letter or a word (or sentence)
        if (input.length == 1) {
            // If the letter isn't already used and it's a valid letter and update the game
            if (
                !(await usedItems.letters.includes(input.toLowerCase())) &&
                (await input.match(/[a-z]/i))
            ) {
                if (isLetterInWord(toFindArray, input))
                    displayedArray = await discoverLetter(
                        toFindArray,
                        displayedArray,
                        input
                    )
                else failCounter++
                await usedItems.letters.push(input.toLowerCase())
            }
        } else {
            // If the entry is not already used update the game
            input = await input.replaceAll(' ', ' ')
            if (!usedItems.words.includes(input)) {
                if (
                    input.toLowerCase() ===
                    (await toFindArray.join('').toLowerCase())
                ) {
                    displayedArray = toFindArray
                    isWin = true
                } else {
                    await usedItems.words.push(input)
                    failCounter++
                }
            }
        }

        // Check if the game is finished or not
        if (await compareArrays(displayedArray, toFindArray)) {
            isWin = true
            await embed.setDescription(`Jeu de pendu terminé, **bravo** 👏`)
        } else if (failCounter == 7) {
            isFail = true
            await embed.setDescription(`Jeu du pendu terminé, **dommage** 😦`)
            displayedArray = toFindArray
        }

        // Delete the proposition message of the user
        try {
            await m.delete()
        } catch (error) {
            console.error(error)
        }

        // Update the game message
        embed = await updateEmbed(embed, failCounter, displayedArray, usedItems)
        try {
            await message.edit({ embeds: [embed] })
        } catch (error) {
            console.error(error)
            return
        }

        // Next phase of the game if not finished
        if (!isWin && !isFail)
            game(
                message,
                toFindArray,
                displayedArray,
                usedItems,
                failCounter,
                embed
            )
        else {
            let thread = message.channel
            let name = thread.name
            await thread
                .setName(name.slice(0, -10) + '(terminée)')
                .catch((r) => r)
            await thread.setLocked(true).catch((r) => r)
            await thread.setArchived(true).catch((r) => r)
        }
    })

    // If the collector runs out of time the game is lost
    collector.on('end', async (collected, reason) => {
        if (reason === 'time') {
            await embed.setDescription(`Jeu du pendu terminé, **dommage** 😦`)
            displayedArray = toFindArray
            embed = await updateEmbed(
                embed,
                failCounter,
                displayedArray,
                usedItems
            )
            try {
                await message.edit({ embeds: [embed] })
            } catch (error) {
                console.error(error)
            }
            let thread = message.channel
            let name = thread.name
            await thread
                .setName(name.slice(0, -10) + '(terminée)')
                .catch((r) => r)
            await thread.setLocked(true).catch((r) => r)
            await thread.setArchived(true).catch((r) => r)
        }
    })
}
