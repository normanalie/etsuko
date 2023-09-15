const addReactions = (message, reactions) => {
    reactions.forEach((reaction) => {
        message.react(reaction)
    })
}

exports.addReactions = addReactions
