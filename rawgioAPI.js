const axios = require("axios");
require("dotenv").config({ path: "./rawgioAPI.env" });

const rawgKey = process.env.rawgKey;

async function getGamePublishers(gameId) {
  try {
    const response = await axios.get(`https://api.rawg.io/api/games/${gameId}`, {
      params: { key: rawgKey },
    });

    return response.data.publishers
      ? response.data.publishers.map((p) => p.name).join(", ")
      : "Unknown";
  } catch (error) {
    console.error(`Error fetching publisher for game ID ${gameId}:`, error.message);
    return "Unknown";
  }
}

module.exports = { getGamePublishers };
