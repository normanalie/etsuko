const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { google } = require("googleapis");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mdr')
        .setDescription("Envoie une blague pas forcément très drôle")
        .addBooleanOption(option =>
            option.setName('dark')
                .setDescription("Tu veux une blague dark ?")),
    async execute(interaction) {
        // Send message to inform that the command is starting
        try {
            await interaction.deferReply({ fetchReply: true });
        } catch (error) {
            return;
        }

        // Get whether the joke must be dark or not
        let rangeName;
        let color;
        if (interaction.options.getBoolean('dark')) {
            rangeName = "Dark";
            color = "Red";
        } else {
            rangeName = "Normal";
            color = "Green";
        }

        // Connect to the Google spreadsheet
        const auth = new google.auth.GoogleAuth({
            keyFile: "credentials.json",
            scopes: "https://www.googleapis.com/auth/spreadsheets",
        });
        const client = await auth.getClient();
        const googleSheets = google.sheets({version: "v4", auth: client});
        const spreadsheetId = "1JDX7zJ0jX076zEf75VdoT0WnVSky9koAb14m_PluvS8";

        // Get all the entries in the sheet
        const getRows = await googleSheets.spreadsheets.values.get({
            auth: auth,
            spreadsheetId: spreadsheetId,
            range: rangeName
        });
        const values = getRows.data.values;
        
        // Select one at random
        let index = Math.floor(Math.random() * values.length);
        const joke = {title: values[index][0], description: values[index][1]};

        // Send the joke
        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(joke.title)
            .setDescription(joke.description);

        try {
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            
        }
    }
}