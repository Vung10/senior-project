const axios = require("axios");
require("dotenv").config({ path: "./chatgptAPI.env" });

async function getChatGPTResponse(prompt) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.chatgptAPIKEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error from OpenAI:", error.response?.data || error.message);
    return null;
  }
}

module.exports = { getChatGPTResponse };
