const { supabase } = require('../supabase')

async function getTrackedMessage(client, id) {
    try {
        const { data, error } = await supabase
            .from('trackedMessages')
            .select()
            .eq('id', id)

        if (error) {
            throw new Error(error.message)
        }

        if (data && data.length > 0) {
            const message = await client.channels.cache
                .get(`${data[0].channelId}`)
                .messages.fetch(`${data[0].messageId}`)
            return message
        } else {
            throw new Error("Aucun message de bienvenue n'a été trouvé.")
        }
    } catch (error) {
        console.error(
            'Erreur lors de la récupération du message de bienvenue :',
            error
        )
        return null
    }
}

async function getPrograms() {
    try {
        const { data, error } = await supabase.from('programs').select()

        if (error) {
            throw new Error(error.message)
        }

        if (data && data.length > 0) {
            return data
        } else {
            throw new Error("Aucune filière n'a été trouvée")
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des filières :', error)
    }
}

exports.getTrackedMessage = getTrackedMessage
exports.getPrograms = getPrograms
