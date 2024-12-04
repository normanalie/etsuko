const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');
const { YEAR, SESSION_COOKIE, LEADERBOARD_ID } = require('../asset/credential_aoc.js')

/**
 * Récupère le classement du leaderboard AoC
 * @returns {Promise<Object|null>} Classement JSON ou null en cas d'erreur
 */
async function fetchLeaderboard() {
  const url = `https://adventofcode.com/${YEAR}/leaderboard/private/view/${LEADERBOARD_ID}.json`;
  try {
    const response = await axios.get(url, {
      headers: {
        Cookie: `session=${SESSION_COOKIE}`
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
                    ":four:",":five:",":six:",":seven:",":eight:",":nine:",":ten:"];

                    
  sortedMembers.forEach((member, index) => {
    if (index < 10){
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

  setInterval(async () => {
    const leaderboard = await fetchLeaderboard();

    if (!leaderboard) {
      console.error('Impossible de récupérer le classement pour la mise à jour automatique.');
      return;
    }

    const classement = formatLeaderboard(leaderboard);

    channel.send({
      content: `📊 **Mise à jour automatique du classement Advent of Code :**
${classement} 🎉`,
    });
  }, interval);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('adventofcode')
    .setDescription('Affiche le classement de l\'Advent of Code.'),
  async execute(interaction) {
    await interaction.deferReply(); // Permet de répondre plus tard si le traitement est long

    const leaderboard = await fetchLeaderboard();
    if (!leaderboard) {
      await interaction.editReply('Impossible de récupérer le classement pour le moment.');
      return;
    }

    const classement = formatLeaderboard(leaderboard);
    await interaction.editReply(classement);

    // Planifie les mises à jour automatiques toutes les 12 heures dans le même canal
    const channel = interaction.channel;
    scheduleLeaderboardUpdate(channel);
  },
};
