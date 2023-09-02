const { formatDate } = require("../functions.js");
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { stripIndents } = require("common-tags");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whois')
        .setDescription("Renvoie les informations d'utilisateur")
        .addUserOption(option => 
            option.setName('cible')
                .setDescription(`L'utilisateur dont tu veux les informations`)),
    async execute(interaction) {
        // Get the target
        let target = interaction.options.getMember('cible');

        // If there's no target, the target is the user itself
        if (target == null)
            target = interaction.member;

        const member = target;

        // Member variables
        const joined = formatDate(member.joinedAt);
        const roles = member.roles.cache
            .filter(r => r.id !== interaction.guildId)
            .map (r => r)
            .join(", ") || "none";

        // User variables
        const created = formatDate(member.user.createdAt);

        // Create the message
        const embed = new EmbedBuilder()
            .setFooter({ text: member.displayName, iconURL: member.user.displayAvatarURL() })
            .setThumbnail(member.user.displayAvatarURL())
            .setColor(member.displayHexColor === "#000000" ? 0xFFFFFF : parseInt(member.displayHexColor.replace(/^#/, ''), 16))
            
            .addFields(
                { name: 'Informations membre', value: stripIndents`**Nom:** ${member.displayName}
                **Rejoint le:** ${joined}
                **Rôle(s):** ${roles}`, inline: true },
                { name: 'Informations utilisateur', value: stripIndents`**ID:** ${member.user.id}
                **Nom de l'utilisateur:** ${member.user.username}
                **Tag Discord:** ${member.user.tag}
                **Compte créé le:** ${created}`, inline: true})
            
            .setTimestamp();

        // If the target as a presence set, add it to the informations
        if (member.presence) {
            let activities = member.presence.activities;
            if (activities.length > 0) {
                if (activities[0].name === "Custom Status") {
                    embed.addFields({ name: "Actu", value: `**Activité:** ${activities[0].state}`, inline: false});
                } else {
                    embed.addFields({ name: "En cours d'utilisation", value: `**Logiciel:** ${activities[0].name}`, inline: false});
                }
            }
        }

        // Send the informations
        try {
            await interaction.reply({ embeds: [embed] });    
        } catch (error) {
            
        }
    }
}