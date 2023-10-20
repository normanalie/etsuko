const { ChannelType } = require('discord.js')

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
