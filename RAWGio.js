const axios = require("axios");
require("dotenv").config({path: "./rawgioAPI.env"}); 

const rawgKey = process.env.rawgKey;
const rawgUrl = "https://api.rawg.io/api/games";
const rawgDeveloperUrl = "https://api.rawg.io/api/developers";
async function getRawgioGames() {
  try{
    const totalPages = 1000;
    const randomPage = Math.floor(Math.random() * totalPages) + 1;

    const response = await axios.get(rawgUrl, {
        params: {
          key: rawgKey, 
          page_size: 20, 
          page: randomPage,
        },
      });
  
    const games = response.data.results;  // Get the games list
    // Filter out games with empty names
    const filteredGames = games.filter(game => game.name.trim() !== "");
    const formattedGames = filteredGames.map((game) => ({
        id: game.id,
        title: game.name,
        image: game.background_image,
        genre: game.genres.map((g) => g.name).join(", ") || "Unknown",
        platform: game.platforms
        ? game.platforms
            .map((p) => p.platform.name) // Extract platform names
            .map((p) =>
              p.toLowerCase() === "windows" || p.toLowerCase() === "linux" || p.toLowerCase() === "macos"
                ? "PC" // Keep PC but modify as needed
                : p.charAt(0).toUpperCase() + p.slice(1) // Capitalize first letter
            )
            .filter((platform, index, self) => self.indexOf(platform) === index) // Remove duplicates
            .join(", ")
        : "Unknown",
        release_date: game.released || "Unknown",
        
        voice_chat: game.tags?.some(tag => tag.name ==="Voice_chat") ? "Yes" : "No",
        multiplayer: game.tags?.some(tag => tag.name === "Multiplayer") ? "Yes" : "No",
        matchmaking: game.tags?.some(tag => tag.name === "Online PvP") ? "Yes" : "No",
        summary: game.summary || "Unknown",

      
      }));
  
    
    return formattedGames; 

  } catch (error) {
    console.error("Error fetching games:", error.message);
    return [];
  }
}
module.exports = { getRawgioGames };