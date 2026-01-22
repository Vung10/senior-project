const axios = require("axios");
const { getSteamGames } = require("./steamDB");
const { mySQLsaveGameToDB } = require("./mySQLsaveToDB");
async function getGameDetails(appid) {
  try {
    const response = await axios.get(
      `https://store.steampowered.com/api/appdetails?appids=${appid}`
    );
    const gameData = response.data[appid].data;

    if (!gameData) return null; // If no data, return null
    const categories = gameData.categories || [];
    const multiplayerModes = categories.map((categor) => categor.description);

    return {
      appid: appid, 
      title: gameData.name || "Unknown",
      image: gameData.header_image,
      genre: gameData.genres
        ? gameData.genres.map((g) => g.description).join(", ")
        : "Unknown",
      platform: gameData.platforms
        ? Object.keys(gameData.platforms)
            .filter((key) => gameData.platforms[key]) 
            .map((p) =>
                p === "windows" || p === "linux" || p === "mac"
                  ? "PC"+ p.slice(7)
                  : p.charAt(0).toUpperCase() + p.slice(1)
            )
            .filter((platform, index, self) => self.indexOf(platform) === index)
            .join(", ")
        : "Unknown",
      developer: gameData.developers
        ? gameData.developers.join(", ")
        : "Unknown",
      publisher: gameData.publishers
        ? gameData.publishers.join(", ")
        : "Unknown",
      release_date: gameData.release_date
        ? gameData.release_date.date
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
  } catch (error) {
    console.error(`Error fetching details for appid ${appid}:`, error);
    return null;
  }
}

async function fetchAllGameDetails() {
  const games = await getSteamGames(); // Get game list from steamDB.js
  const start = Math.floor(Math.random() * (games.length - 20));
  const topGames = games.slice(start, start + 20); //test 20 game
  
  // ✅ Fetch details only once for each game
  const gameDetails = await Promise.all(
    topGames.map((game) => getGameDetails(game.appid))
  );

  /*
  const gameDetails = await Promise.all(
    topGames.map((game) => getGameDetails(game.appid))
  );
  return gameDetails.filter((game) => game !== null); // Remove null values
   */
  // ✅ Save to DB and return non-null details
  
  return gameDetails.filter((game) => game !== null); // Remove null values
}


module.exports = { fetchAllGameDetails };
