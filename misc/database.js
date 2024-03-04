const { supabase } = require('../supabase')

/**
 * Retrieves a tracked message from the database and returns the corresponding message object.
 * @param {object} client - The Discord client object.
 * @param {string} id - The ID of the tracked message.
 * @returns {object|null} - The tracked message object, or null if not found or an error occurs.
 */
async function getTrackedMessage(client, id) {
    try {
        // Retrieve tracked message from the database
        const { data, error } = await supabase
            .from('trackedMessages')
            .select()
            .eq('id', id)

        if (error) {
            throw new Error(
                'Error retrieving tracked message: ' + error.message
            )
        }

        if (data && data.length > 0) {
            // Retrieve message from Discord channel
            const message = await client.channels.cache
                .get(`${data[0].channelId}`)
                .messages.fetch(`${data[0].messageId}`)
            return message
        } else {
            throw new Error('Tracked message not found.')
        }
    } catch (error) {
        console.error('Error retrieving tracked message:', error)
        return null
    }
}

/**
 * Stores a message in the database, to be retrieved later using its ID.
 * @param {string} id - The ID of the message.
 * @param {string} channelId - The ID of the channel where the message is stored.
 * @param {string} messageId - The ID of the message to store.
 * @returns {Promise<object>} - The tracked message object, or null if an error occurs.
 */
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
            throw new Error('Message not found.')
        }
    } catch (error) {
        console.error('Error when storing message:', error)
        return null
    }
}

/**
 * Asynchronously retrieves the programs from the database and processes the data to return an array of program objects with specific fields.
 * A "program" in this context represents a specific field of study within an engineering school. The database stores information related to various programs, including their role, display name, description, and whether they are associated with student roles.
 *
 * @return {Array} An array of program objects with specific fields.
 */
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

/**
 * Retrieves the role with the given name from the 'roles' table in the database.
 *
 * @param {string} roleName - The name of the role to retrieve
 * @return {Promise<object>} The role data if found, otherwise an error is thrown
 */
exports.getRole = async (roleName) => {
    try {
        const { data, error } = await supabase
            .from('roles')
            .select()
            .eq('name', roleName)
            .single()

        if (error) {
            throw new Error(error.message)
        }

        if (data) {
            return data
        } else {
            throw new Error('The role was not found.')
        }
    } catch (error) {
        console.error('Error retrieving roles:', error)
    }
}

exports.getTrackedMessage = getTrackedMessage
exports.getPrograms = getPrograms
exports.setTrackedMessage = setTrackedMessage
