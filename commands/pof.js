const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pof')
        .setDescription("Lance un pile ou face"),
    async execute(interaction) {
        // Send message to inform that the command is starting
        try {
            await interaction.deferReply({ fetchReply: true });
        } catch (error) {
            return;
        }

        // Send a gif to the user
        let embed = new EmbedBuilder()
            .setColor("Random")
            .setImage("https://gifimage.net/wp-content/uploads/2018/11/pile-ou-face-gif-1.gif");
        try {
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            
        }
        await wait(2000);

        // Get the result embed and send it
        embed = createEmbedResult(embed);
        try {
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            
        }
    }
}

// Get the description and the image
function createEmbedResult(embed) {
    let number = Math.floor(Math.random() * 2);
    let slide = Math.floor(Math.random() * 1000);

    if (number == 0) {
        embed.setImage("https://media.discordapp.net/attachments/701111666888409198/782524597491990538/mhOziRRl6gN9h2XwclHTyYRAUv4mRvciRyPFXCNVn4tKdllwVAg5ThqW5DSR7HUACL5pwIHDdQ.png")
            .setDescription("**PILE**");
    } else if (number == 1) {
        embed.setImage("https://media.discordapp.net/attachments/701111666888409198/782524679075266590/oHWmzRzYATJBDwdlh_Xz5cKklbljkzN1QjUkibbZUkuqui99cbzUxyfQ5mAu6LN0t7n7cwr9dg.png")
            .setDescription("**FACE**");
    }

    if (slide <= 4)
    embed.setImage("https://cdn.discordapp.com/attachments/701111666888409198/805801192994111528/shcyehefusb41.png")
        .setDescription("**TRANCHE**");

    return embed;
}