const axios = require("axios");
require("dotenv").config({path: "./accessToken.env"});

const igdbUrl = "https://api.igdb.com/v4/games";
const igdbUrl2 = "https://api.igdb.com/v4/involved_companies";

const clientId = process.env.client_id;
const accessToken = process.env.access_token;
 
async function getIgdbGames() {
  try {
    const maxOffset = 5000;
    const randomOffset = Math.floor(Math.random() * maxOffset);

    // Send POST request to IGDB API
    const response = await axios.post(
      igdbUrl,
      
      "fields name, cover.image_id, genres.name, platforms.name, involved_companies, release_dates.human; limit 100;",
      {
        headers: {
          "Client-ID": clientId,
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    );

    const gameData = response.data; // Get the game data
    
    // Filter out games with empty names (samw as Steam filter)
    const filteredGames = gameData.filter(
      (game) => game.name && game.name.trim() !== ""
    );
    const categories = filteredGames.categories || [];
    const multiplayerModes = categories.map((categor) => categor.description);
    const formatting = filteredGames.map((game) => {
      
      return {
        appid: game.id, 
        title: game.name || "Unknown",
        image: game.cover
          ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
          : null,

        genre: game.genres
          ? game.genres.map((g) => g.name).join(", ") 
          : "Unknown",
        platform: game.platforms
          ? game.platforms.map((p) => p.name.charAt(0).toUpperCase() + p.name.slice(1)).join(", ") 
          : "Unknown",
        developer: game.involved_companies
          ? game.involved_companies.map((d) => d.name).join(", ")
          :"Unknown",
        publisher: game.publishers
          ? game.publishers.map((p) => p.name).join(", ") 
          : "Unknown",
        release_date: game.release_dates && game.release_dates[0]
          ? game.release_dates[0].human || "Unknown" 
          : "Unknown",
          multiplayer: multiplayerModes.includes("Multi-player") ? "Yes" : "No",
          cross_gen_multiplayer: multiplayerModes.includes(
            "Cross-Platform Multiplayer"
          )
            ? "Yes"
            : "No",
          voice_chat: multiplayerModes.includes("Online PvP") ? "Yes" : "Unknown",
          matchmaking: multiplayerModes.includes("Online PvP") ? "Yes" : "Unknown",
          summary: gameData.summary || "Unknown",
      };
    });

    return formatting; // Return the formatted games
  } catch (error) {
    console.error("Error fetching IGDB games:", error.message);
    return [];
  }
}

module.exports = { getIgdbGames };
