const { Collection } = require('discord.js')

const fs = require('fs')
const path = require('path')

module.exports = function collectSlashCommands(directory_path) {
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
