const { SlashCommandBuilder } = require('discord.js');
const { google } = require("googleapis");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addmdr')
        .setDescription("Propose une blague pour la base de donnée des blagues du bot")
        .addBooleanOption(option =>
            option.setName("dark")
                .setDescription("La blague est dark ou pas ?")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("introduction")
                .setDescription("La ou les phrases d'introduction de la blague")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("chute")
                .setDescription("La ou les phrases de chute de la blague")
                .setRequired(true)),
    async execute(interaction) {
        // Send personal message to inform that the command is starting
        try {
            await interaction.deferReply({ fetchReply: true, ephemeral: true });
        } catch (error) {
            
        }

        // Check whether the proposition is a dark joke or not
        let rangeName;
        if (interaction.options.getBoolean('dark'))
            rangeName = "PropositionsDark!A:B";
        else
            rangeName = "PropositionsNormal!A:B";
        
        // Connect to the Google speadsheet
        const auth = new google.auth.GoogleAuth({
            keyFile: "credentials.json",
            scopes: "https://www.googleapis.com/auth/spreadsheets",
        });
        const client = await auth.getClient();
        const googleSheets = google.sheets({version: "v4", auth: client});
        const spreadsheetId = "1JDX7zJ0jX076zEf75VdoT0WnVSky9koAb14m_PluvS8";

        // Append the new entry to the spreadsheet
        await googleSheets.spreadsheets.values.append({
            auth: auth,
            spreadsheetId: spreadsheetId,
            range: rangeName,
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [
                    [interaction.options.getString("introduction"), interaction.options.getString("chute")]
                ]
            }
        });

        // Send final message
        try {
            await interaction.editReply(`Proposition envoyée`);
        } catch (error) {
            
        }
    }
}