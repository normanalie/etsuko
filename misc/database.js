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

async function setTrackedMessage(id, channelId, messageId) {
    try {
        const { data, error } = await supabase
            .from('trackedMessages')
            .upsert({ id: id, channelId: channelId, messageId: messageId })
            .select()
        if (error) {
            throw new Error(error.message)
        }

        if (data && data.length > 0) {
            return data[0]
        } else {
            throw new Error("Aucun message n'a été trouvé.")
        }
    } catch (error) {
        console.error("Erreur lors de l'enregistrement du message", error)
        return null
    }
}

async function getPrograms() {
    try {
        const { data, error } = await supabase
            .from('programs')
            .select('*, role(*)')
            .order('customOrder', { ascending: true })

        if (error) {
            throw new Error(error.message)
        }

        if (data && data.length > 0) {
            let ret = []
            data.forEach((element) => {
                ret.push({
                    roleid: element.role.roleid,
                    name: element.role.name,
                    displayname: element.displayname,
                    desc: element.desc,
                    isStudent: element.role.isStudent,
                })
            })
            return ret
        } else {
            throw new Error("Aucune filière n'a été trouvée")
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des filières :', error)
    }
}

exports.getRole = async (name) => {
    try {
        const { data, error } = await supabase
            .from('roles')
            .select()
            .eq('name', name)
            .single()

        if (error) {
            throw new Error(error.message)
        }

        if (data) {
            return data
        } else {
            throw new Error("Le role n'a pas été trouvé.")
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des roles :', error)
    }
}

exports.getTrackedMessage = getTrackedMessage
exports.getPrograms = getPrograms
exports.setTrackedMessage = setTrackedMessage
