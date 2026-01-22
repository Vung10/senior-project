const axios = require("axios");
require("dotenv").config({ path: "./accessToken.env" });

const igdbUrl = "https://api.igdb.com/v4/involved_companies";
const clientId = process.env.client_id;
const accessToken = process.env.access_token;

async function getIgdbCompanies() {
  try {
    // Send POST request to IGDB API
    const response = await axios.post(
      igdbUrl,
      `fields company.name, developer, publisher, game;
   where developer = true | publisher = true;
   limit 20;`, // adjust limit as needed

      {
        headers: {
          "Client-ID": clientId,
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    );

    const companies = response.data; // Get the company data

    const formatting = companies.map((company) => {
      return {
        game_id: entry.game, // You’ll use this to link back to the game
    developer: entry.developer ? entry.company?.name || "Unknown" : null,
    publisher: entry.publisher ? entry.company?.name || "Unknown" : null,

      };
    });

    return formatting; // Return the formatted companies
  } catch (error) {
    console.error("Error fetching IGDB companies:", error.message);
    return [];
  }
}

module.exports = { getIgdbCompanies };
