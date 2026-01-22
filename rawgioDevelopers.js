const axios = require("axios");
require("dotenv").config({ path: "./rawgioAPI.env" });

const rawgKey = process.env.rawgKey;

async function getGameDevelopers(gameId) {
  try {
    const response = await axios.get(`https://api.rawg.io/api/games/${gameId}`, {
      params: { key: rawgKey },
    });

    return response.data.developers
      ? response.data.developers.map((d) => d.name).join(", ")
      : "Unknown";
  } catch (error) {
    console.error(`Error fetching developer for game ID ${gameId}:`, error.message);
    return "Unknown";
  }
}

module.exports = { getGameDevelopers };
