const db = require("./mySQLconnect");

async function mySQLsaveGameToDB(game) {
  try {
    const title = game.title || game.name;
    const [rows] = await db.query("SELECT id FROM games WHERE title = ?", [game.title]);

    if (rows.length > 0) {
      console.log(`Game "${title}" already exists. Skipping.`);
      return;
    }
    
    if (
      !game.developer || game.developer === "Unknown" ||
      !game.publisher || game.publisher === "Unknown" ||
      !game.image || game.image === "Unknown" ||
      !game.genre || game.genre === "Unknown"
    ) {
      console.log(`Skipping incomplete game: ${title}`);
      return;
    }
    await db.query(`
      INSERT INTO games (title, image, platforms, genre, developer, publisher, release_date, voice_chat, multiplayer, matchmaking, summary)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        game.image || "Unknown",
        game.platforms || game.platform || "Unknown",
        game.genre || "Unknown",
        game.developer || "Unknown",
        game.publisher || "Unknown",
        game.release_date || "Unknown",
        game.voice_chat || "Unknown",
        game.multiplayer || "Unknown",
        game.matchmaking || "Unknown",
        game.summary || "Unknown"
      ]
    );

    console.log(`✅ Saved: ${game.name}`);
  } catch (error) {
    console.error(`❌ Error saving ${game.name}:`, error);
  }
}

module.exports = { mySQLsaveGameToDB };
