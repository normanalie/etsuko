const { stripIndent } = require('common-tags');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { shuffle, promptMessage } = require('../functions');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tirage')
        .setDescription("Lance un tirage de cartes de tarot")
        .addIntegerOption(option => 
            option.setName('carte1')
                .setDescription("Le numéro de la 1e carte que tu souhaites tirer")
                .setMinValue(1)
                .setMaxValue(22)
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('carte2')
                .setDescription("Le numéro de la 2e carte que tu souhaites tirer")
                .setMinValue(1)
                .setMaxValue(22)
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('carte3')
                .setDescription("Le numéro de la 3e carte que tu souhaites tirer")
                .setMinValue(1)
                .setMaxValue(22)
                .setRequired(true))
        .addStringOption(option =>
            option.setName('raison')
                .setDescription("La raison de ton tirage")
                .setRequired(true)),
    async execute(interaction) {
        // Send message to inform that the command is starting
        try {
            await interaction.deferReply({ fetchReply: true });
        } catch (error) {
            return;
        }

        // Get the card numbers
        const cards = [interaction.options.getInteger('carte1'), interaction.options.getInteger('carte2'), interaction.options.getInteger('carte3')];
        
        // Cannot select 2 times the same card
        if ((cards[0] == cards[1]) || (cards[0] == cards[2]) || (cards[1] == cards[2])) {
            try {
                await interaction.editReply("Les numéros de carte ne doivent pas être identiques");
            } catch (error) {
                
            }
            await wait(5000);
            try {
                await interaction.deleteReply();
            } catch (error) {
                
            }
            return;
        }

        const member = interaction.member;

        // Create the deck and shuffle it
        for (var deck = [], i = 0; i < 22; ++i) deck[i] = i;
        deck = shuffle(deck);

        let message = new EmbedBuilder()
            .setColor("Random")
            .setDescription(`**${member.displayName}**, tu choisis donc les cartes n°${cards[0]}, ${cards[1]} et ${cards[2]} ?`);

        try {
            // Demand to the user if this is right
            await interaction.editReply({ embeds: [message] }).then(async msg => {
                const emoji = await promptMessage(msg, interaction.user, 60, ["✅", "❌"]);
    
                // If the user accepts removes the reactions and edit the message with the result
                if (emoji === "✅") {
                    let name1 = nameCard(deck[cards[0]-1]);
                    let name2 = nameCard(deck[cards[1]-1]);
                    let name3 = nameCard(deck[cards[2]-1]);
                    let luck = luckCalculation(cards);
    
                    message.setColor("Random")
                        .setDescription(stripIndent `**${member.displayName}**, tes cartes sont **${name1}**, **${name2}** et **${name3}** pour le motif : **${interaction.options.getString('raison')}**
                        
                        Evaluation : **${luck}** (A titre indicatif, c'est pas toujours représentatif)`);
    
                    try {
                        msg.reactions.removeAll();
                    } catch (error) {
                        
                    }
                    
                    try {
                        await interaction.editReply({ embeds: [message] });
                    } catch (error) {
                        
                    }
                }
                // Else delete the message 
                else {
                    try {
                        await interaction.deleteReply();
                    } catch (error) {
                        
                    }
                }
            });
        } catch (error) {
            
        }
    }
}

// Get the name of a card by it's number
function nameCard(number) {
    switch (number) {
        case 0: return "le fou (0)";
        case 1: return "le magicien (1)";
        case 2: return "la papesse (2)";
        case 3: return "l'impératrice (3)";
        case 4: return "l'empereur (4)";
        case 5: return "le pape (5)";
        case 6: return "l'amoureux (6)";
        case 7: return "le chariot (7)";
        case 8: return "la justice (8)";
        case 9: return "l'hermite (9)";
        case 10: return "la roue de la fortune (10)";
        case 11: return "la force (11)";
        case 12: return "le pendu (12)";
        case 13: return "la mort (13)";
        case 14: return "la tempérance (14)";
        case 15: return "le diable (15)";
        case 16: return "la tour (16)";
        case 17: return "l'étoile (17)";
        case 18: return "la lune (18)";
        case 19: return "le soleil (19)";
        case 20: return "le jugement (20)";
        case 21: return "le monde (21)";
        default : console.error("Erreur lors de la détermination du nom de carte de la fonction 'tirage'. Nombre testé :", number); break;
    }
}

// Get a indicatif number for luck (each card can be positive, negative or neutral)
function luckCalculation(cards) {
    let luck = 3;
    let results = ["extrêmement négatif", "négatif", "plutôt négatif", "neutre", "plutôt positif", "positif", "extrêmement positif"];

    cards.forEach(card => {
        switch (card) {
            case 0: --luck; break;
            case 4: ++luck; break;
            case 5: ++luck; break;
            case 7: ++luck; break;
            case 8: --luck; break;
            case 11: ++luck; break;
            case 12: --luck; break;
            case 13: --luck; break;
            case 15: --luck; break;
            case 16: --luck; break;
            case 17: ++luck; break;
            case 18: --luck; break;
            case 19: ++luck; break;
            case 21: ++luck; break;
            default: luck = luck; break;
        }
    });

    return results[luck];
}