const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { promptMessage } = require('../functions');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pfc')
        .setDescription("Lance une partie de pierre feuille ciseaux")
        .addUserOption(option =>
            option.setName('adversaire')
                .setDescription("La personne que tu veux affronter")
                .setRequired(true)),
    async execute(interaction) {
        let message;
        // Send message to inform that the command is starting
        try {
            message = await interaction.deferReply({ fetchReply: true });
        } catch (error) {
            return;
        }
        
        // Get the 2 players
        const player1 = interaction.member;
        const player2 = interaction.options.getMember('adversaire');

        // Cannot play against youself
        if (player1 === player2) {
            try {
                await interaction.editReply("Choisis quelqu'un d'autre que toi");
            } catch (error) {
                
            }
            await wait(5000);
            try {
                await interaction.deleteReply();
            } catch (error) {
                
            }
            return;
        }

        // Cannot play against a bot except for this bot
        if (player2.user.bot && player2.user.id !== interaction.client.user.id) {
            try {
                await interaction.editReply("Le 2e joueur doit être humain (ou moi)");
            } catch (error) {
                
            }
            await wait(5000);
            try {
                await interaction.deleteReply();
            } catch (error) {
                
            }
            return;
        }

        // Change the message to blank while the game is on
        try {
            await interaction.editReply("** **");
        } catch (error) {
            
        }
        launchGame(message, player1, player2);
    }
}

// Send a message to the players and get the results to edit the game message
async function launchGame(message, player1, player2) {
    let msg1 = await player1.user.send(`Pierre, feuille, ciseaux (t'as 30s)`);
    let msg2;
    if (!player2.user.bot) {
        msg2 = await player2.user.send(`Pierre, feuille, ciseaux (attends les emojis et t'auras 30s)`);
    }

    let rep1 = await promptMessage(msg1, player1, 30, ["✊", "✋", "✌"]);
    let rep2 = undefined;
    if (!player2.user.bot) {
        rep2 = await promptMessage(msg2, player2, 30, ["✊", "✋", "✌"]);
    } else {
        let possibleResponses = ["✊", "✋", "✌"];
        rep2 = possibleResponses[Math.floor(Math.random() * possibleResponses.length)];
    }

    let res = getResult(player1, player2, rep1, rep2);

    if (rep1 === undefined) rep1 = "Pas de choix";
    if (rep2 === undefined) rep2 = "Pas de choix";

    let embed = new EmbedBuilder()
        .setColor("Random")
        .addFields(
            { name: 'Résultats', value: res, inline: false },
            { name: player1.displayName, value: rep1, inline: true},
            { name: 'vs', value: 'vs', inline: true },
            { name: player2.displayName, value: rep2, inline: true },
            { name: 'Vous voulez recommencer ?', value: `C'est celui qui a lancé la commande qui choisit et il a 30s`, inline: false }
        );
    
    try {
        await message.edit({ embeds: [embed] });
        let replyToRematch = await promptMessage(message, player1, 30, ["✅", "❌"]);

        message.reactions.removeAll();
        if (replyToRematch === "✅") 
            launchGame(message, player1, player2);
    } catch (error) {
        
    }
}

// Get who wins
function getResult(player1, player2, rep1, rep2) {
    if (rep1 === undefined || rep2 === undefined) {
        return `Partie annulée`;
    } else if ((rep1 === "✊" && rep2 === "✌") ||
        (rep1 === "✋" && rep2 === "✊") ||
        (rep1 === "✌" && rep2 === "✋")) {
            return `${player1.displayName} gagne`;
    } else if (rep1 === rep2) {
        return `Egalité`;
    } else {
        return `${player2.displayName} gagne`;
    }
}