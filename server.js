const express = require('express');
const app = express();
const mysql = require("mysql2");
require('dotenv').config();
require("dotenv").config({path: "./chatgptAPI.env"}); 
const cors = require('cors');
app.use(cors());
const gameDetails = require("./gameDetails");
const getIgdbGames  = require('./IGDB');
const getRawgioGames = require('./RAWGio.js');
const { getGameDevelopers } = require("./rawgioDevelopers");
const { getGamePublishers } = require("./rawgioPublisher.js");
const { fillMissingFields } = require("./fillMissingFields");
const { mySQLsaveGameToDB } = require("./mySQLsaveToDB");
const db = require("./mySQLconnect");


app.get("/api", (req, res) => {
    res.send("Welcome to the Cross-Platform Games API! Available routes: <br> \
    <a href='/api/games'>/api/games</a> - Get all games <br>");
  });


// Fetch All Games
app.get("/api/gamesList", async (req, res) => {
    try{
      const filteredGames = await gameDetails.fetchAllGameDetails(); 
      const igdbGames = await getIgdbGames.getIgdbGames();
      const rawgioGame = await getRawgioGames.getRawgioGames();
      // Fetch developers for each game
    const gamesWithDevelopers = await Promise.all(
      rawgioGame.map(async (game) => ({
        ...game,
        developer: await getGameDevelopers(game.id),
        publisher: await getGamePublishers(game.id),
      }))
    );

      const combinedGames = [...filteredGames, ...igdbGames, ...gamesWithDevelopers];

       // 🧠 Automatically fill missing fields with ChatGPT
      const enrichedGames = await Promise.all(
        filteredGames.map(async (game) => await fillMissingFields(game))
      );

      // ✅ Save each enriched game to MySQL
    for (const game of enrichedGames) {
      console.log("Trying to save:", game.title || game.name);
      await mySQLsaveGameToDB(game);
    }

      res.json(enrichedGames); 
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Steam games" });
    }
  });

app.post("/api/fill-missing", async (req, res) => {
  try {
    const updatedGame = await fillMissingFields(req.body);
    res.json(updatedGame);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fill missing fields." });
  }
});

// 🔄 GET all games from local MySQL database
app.get("/api/gamesDB", async (req, res) => {
  try {
    const [games] = await db.query("SELECT * FROM games ORDER BY id DESC");
    res.json(games);
  } catch (error) {
    console.error("❌ Error fetching games from database:", error);
    res.status(500).json({ error: "Failed to fetch games from database" });
  }
});


const PORT = 5000;
app.listen(PORT, () =>{ 
    console.log("Server started on http://localhost:5000/api/gamesList")
})