const { ChannelType } = require('discord.js')

/**
 * Check if the interaction is in a thread.
 *
 * @param {type} interaction - the interaction to check
 * @return {boolean} true if the interaction is in a thread, false otherwise
 */
const inThread = (interaction) => {
    chanType = interaction.channel.type
    if (
        chanType == ChannelType.PublicThread ||
        chanType == ChannelType.PrivateThread ||
        chanType == ChannelType.AnnouncementThread
    )
        return true
    return false
}

exports.inThread = inThread
