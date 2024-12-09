const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');


const LEADERBOARD_ID = '1033978'; // ID du leaderboard
const YEAR = '2024'; // Année de l'AoC

let updateInterval = null;
/**
 * Récupère le classement du leaderboard AoC
 * @returns {Promise<Object|null>} Classement JSON ou null en cas d'erreur
 */
async function fetchLeaderboard() {
  const url = `https://adventofcode.com/${YEAR}/leaderboard/private/view/${LEADERBOARD_ID}.json`;
  try {
    const response = await axios.get(url, {
      headers: {
        Cookie: `session=${process.env.SESSION_COOKIE}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du leaderboard:', error);
    return null;
  }
}

/**
 * Génère une chaîne de caractères contenant le classement
 * @param {Object} leaderboard - Données JSON du leaderboard
 * @returns {string} Classement formaté
 */
function formatLeaderboard(leaderboard) {
  if (!leaderboard || !leaderboard.members) {
    return 'Impossible de récupérer les données du leaderboard.';
  }
  const members = leaderboard.members;
  const sortedMembers = Object.values(members).sort((a, b) => b.local_score - a.local_score);
  let classement = '# **Classement Advent of Code :two: :zero: :two: :four::**\n\n\n';
  let medalarray = [":first_place:", ":second_place:",":third_place:", 
                    ":four:",":five:",":six:",":seven:",":eight:",":nine:"];

                    
  sortedMembers.forEach((member, index) => {
    if (index < 9){
      classement += `${medalarray[index]}    ${member.name || 'Anonyme'}    |    ${member.stars || ''}${member.stars ? ':star:' : '   ' }   ** ${member.local_score > 1 ? 'Points' : 'Point'} : ${member.local_score}**\n`;
    }else{
      classement += ` ${index + 1}.    ${member.name || 'Anonyme'}    |    ${member.stars || ''} ${member.stars ? ':star:' : '   ' }  ** ${member.local_score > 1 ? 'Points' : 'Point'} : ${member.local_score}**\n`;
    }
      
  });


  const timeupdate = new Date();
  classement += `\n\nDernière mise à jour : ${timeupdate.toUTCString()}\n`;


  return classement;
}

/**
 * Programme une mise à jour automatique du classement toutes les 12 heures
 * @param {Object} channel - Canal Discord où envoyer les mises à jour
 */
function scheduleLeaderboardUpdate(channel) {
  const interval = 12 * 60 * 60 * 1000; // 12 heures en millisecondes

  // Si un intervalle existe déjà, le nettoyer
  if (updateInterval) {
    clearInterval(updateInterval);
  }

  updateInterval = setInterval(async () => {
    const leaderboard = await fetchLeaderboard();

    if (!leaderboard) {
      console.error('Impossible de récupérer le classement pour la mise à jour automatique.');
      return;
    }

    const classement = formatLeaderboard(leaderboard);

    channel.send({
      content: `📊 **Mise à jour automatique du classement Advent of Code :**\n${classement} 🎉`,
    });
  }, interval);
}

/**
 * Arrête la mise à jour automatique du classement
 */
function stopLeaderboardUpdate() {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
    console.log('Mise à jour automatique arrêtée.');
  } else {
    console.log('Aucune mise à jour automatique en cours.');
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('adventofcode')
    .setDescription('Gère les mises à jour du classement Advent of Code.')
    .addSubcommand(subcommand => 
      subcommand
        .setName('start')
        .setDescription('Démarre les mises à jour automatiques.'))
    .addSubcommand(subcommand => 
      subcommand
        .setName('stop')
        .setDescription('Arrête les mises à jour automatiques.')),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'start') {
      await interaction.deferReply();

      const leaderboard = await fetchLeaderboard();
      if (!leaderboard) {
        await interaction.editReply('Impossible de récupérer le classement pour le moment.');
        return;
      }

      const classement = formatLeaderboard(leaderboard);
      await interaction.editReply('Mise à jour automatique démarrée. Voici le classement actuel :\n' + classement);

      const channel = interaction.channel;
      scheduleLeaderboardUpdate(channel);
    } else if (subcommand === 'stop') {
      stopLeaderboardUpdate();
      await interaction.reply('Mise à jour automatique arrêtée.');
    }
  },
};
