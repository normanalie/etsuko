const { Collection } = require('discord.js')
const fs = require('fs')
const path = require('path')

const handleSlashCommand = async (interaction) => {
    const command = interaction.client.commands.get(interaction.commandName)
    if (!command)
        throw `[COMMAND] No command matching ${interaction.commandName} was found.`
    await command.execute(interaction)
}

const collectSlashCommands = (directory_path) => {
    let commands = new Collection()
    const files = fs
        .readdirSync(directory_path)
        .filter((file) => file.endsWith('.js'))
    console.log(
        `📂 Slash commands - Discover ${files.length} slash command files.`
    )
    files.forEach((file) => {
        const command = require(path.join(directory_path, file))
        if ('data' in command && 'execute' in command) {
            commands.set(command.data.name, command)
        } else {
            console.warn(
                `[WARNING] Slash commands - Cannot register slash command ${file}.\n    -> Missing 'data' or 'execute' property.`
            )
        }
    })
    return commands
}

exports.handleSlashCommand = handleSlashCommand
exports.collectSlashCommands = collectSlashCommands
