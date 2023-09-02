const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gsoif')
        .setDescription("Lance des roues pour savoir ce que tu vas boire")
        .addIntegerOption(option =>
            option.setName('soft')
                .setDescription("Le nombre de softs disponibles")
                .setMinValue(1)
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('alcool')
                .setDescription("Le nombre d'alcools disponibles")
                .setMinValue(1)
                .setRequired(true)),
    async execute(interaction) {
        // Send message to inform that the command is starting
        try {
            await interaction.deferReply({ fetchReply: true });    
        } catch (error) {
            return;
        }

        // Get the number of softs and alcohols and spin the wheel
        const soft = interaction.options.getInteger('soft');
        const alcohol = interaction.options.getInteger('alcool');
        const wheel = Math.floor(Math.random() * 100) + 1;
        let result;
        let message;

        if(wheel <= 10) result = 1;
        else if(wheel <= 30) result = 2;
        else if(wheel <= 45) result = 3;
        else if(wheel <= 60) result = 4;
        else if(wheel <= 75) result = 5;
        else if(wheel <= 85) result = 6;
        else if(wheel <= 90) result = 7;
        else result = 8;

        // Spin the wheel for the user depending of the result
        if(result == 7 || result == 8) {
            message = "https://media1.giphy.com/media/8wVRtdu0M1u0AvcDVM/giphy.gif?cid=790b761103097ee5bbdad8f33609ecd1d21a439a7b0a730a&rid=giphy.gif&ct=g";
        } else {
            message = "https://giphy.com/gifs/TapTheTable-spin-the-wheel-fortune-tap-table-1dxcPusbzbehNdF5qv?utm_source=media-link&utm_medium=landing&utm_campaign=Media%20Links&utm_term=https://giphy.com/";
        }

        try {
            await interaction.editReply(message).then(async m => {
                let display;
    
                // Edit the gif if necessary
                await wait(2000);
                if (result == 7) {
                    try {
                        m.edit("https://thumbs.gfycat.com/BoldSadDiamondbackrattlesnake-size_restricted.gif");
                    } catch (error) {
                        
                    }
                    await wait(4000);
                } else if (result == 8) {
                    try {
                        m.edit("https://images.squarespace-cdn.com/content/v1/591388866b8f5b73570d7de3/1570030909305-LSMCIHLNZ6WCIRD212RT/giphy.gif");
                    } catch (error) {
                        
                    }
                    await wait(2400);
                }
    
                switch(result) {
                    case 1:
                        display = "de l'eau";
                        break;
                    case 2:
                        display = "le soft n°" + (Math.floor(Math.random() * soft) + 1).toString();
                        break;
                    case 3:
                        display = "l'alcool n°" + (Math.floor(Math.random() * alcohol) + 1).toString();
                        break;
                    case 4:
                        display = "l'alcool n°" + (Math.floor(Math.random() * alcohol) + 1).toString() + " avec le soft n°" + (Math.floor(Math.random() * soft) + 1).toString();
                        break;
                    case 5:
                        display = "l'alcool n°" + (Math.floor(Math.random() * alcohol) + 1).toString() + " avec le soft n°" + (Math.floor(Math.random() * soft) + 1).toString() + " et n°" + (Math.floor(Math.random() * soft) + 1).toString();
                        break;
                    case 6:
                        display = "le soft n°" + (Math.floor(Math.random() * soft) + 1).toString() + " avec le n°" + (Math.floor(Math.random() * soft) + 1).toString();
                        break;
                    case 7:
                        display = "l'alcool n°" + (Math.floor(Math.random() * alcohol) + 1).toString() + " et n°" + (Math.floor(Math.random() * alcohol) + 1).toString() + " avec le soft n°" + (Math.floor(Math.random() * soft) + 1).toString();
                        break;
                    case 8:
                        display = "ce que tu veux";
                        break;
                    default : break;
                }

                // Display the result
                try {
                    m.edit("Tu bois " + display);
                } catch (error) {
                    
                }
            });
        } catch (error) {

        }
    }
}