const axios = require("axios");
require("dotenv").config({path: "./steamAPI.env"}); 

const steamKey = process.env.steamKey;
const steamGames = "https://api.steampowered.com/ISteamApps/GetAppList/v2/";

async function getSteamGames() {
  try{
    const response = await axios.get(steamGames);
    const games = response.data.applist.apps; // Get the games list

    // Filter out games with empty names
    const filteredGames = games.filter(game => game.name.trim() !== "");

    return filteredGames; 

  } catch (error) {
    console.error("Error fetching games:", error.message);
    return [];
  }
}
module.exports = { getSteamGames };