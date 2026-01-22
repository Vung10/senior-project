const { getChatGPTResponse } = require("./chatgptHandler");

async function fillMissingFields(game) {
  let updated = { ...game };

  if (
    game.voice_chat === "Unknown" ||
    game.matchmaking === "Unknown" ||
    game.developer === "" ||
    game.publisher === "Unknown" ||
    game.summary === "Unknown"
  ) {
    const prompt = `The game "${game.name || 'this game'}"${game.developer && game.developer !== "Unknown" ? ` by ${game.developer}` : ""}, genre: ${game.genre}, platform: ${game.platform}, has missing info.

Based on public knowledge:
- Does it support voice chat? Answer "Voice Chat: Yes" or "Voice Chat: No"
- Does it have matchmaking? Answer "Matchmaking: Yes" or "Matchmaking: No"
- What is the name of the developer that develop this game? 
- what is the name of the publisher that publish this game? 
- Write a long 4-5 sentence summary of the game starting with "Summary:"

Reply in this exact format:
Voice Chat: Yes or No
Matchmaking: Yes or No
Developer: name of developer
Publisher: name of publisher
Summary: Long summary here`;

    const chatGPTResponse = await getChatGPTResponse(prompt);

    // Split and process line by line
    const lines = chatGPTResponse.split("\n");
    let inSummary = false;
    updated.summary = "";

    for (const line of lines) {
      if (line.startsWith("Voice Chat:")) {
        updated.voice_chat = line.includes("Yes") ? "Yes" : "No";
        inSummary = false;
      } else if (line.startsWith("Matchmaking:")) {
        updated.matchmaking = line.includes("Yes") ? "Yes" : "No";
        inSummary = false;
      } else if (line.startsWith("Developer:")) {
        console.log("ChatGPT Response:\n", chatGPTResponse);
        updated.developer = line.replace("Developer:", "").trim();
        inSummary = false;
      }else if (line.startsWith("Publisher:")) {
        console.log("ChatGPT Response:\n", chatGPTResponse);
        updated.publisher = line.replace("Publisher:", "").trim();
        inSummary = false;
      }else if (line.startsWith("Summary:")) {
        updated.summary = line.replace("Summary:", "").trim();
        inSummary = true;
      }else if(inSummary){
        updated.summary += " " + line.trim();
      }
    }
  }

  return updated;
}

module.exports = { fillMissingFields };
