const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 5001;

const API_KEY = "AIzaSyCTLJ2cemoCLBBeJGXMEewUq9x0fjtI8JY";
const API_URL = "https://api.generativeai.com/v1/generate";

app.use(cors());
app.use(bodyParser.json());

app.post("/send_message", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ response: "Please provide a valid message." });
  }

  const prompt = `You are a medical assistant. Answer only medical and medical medicine related questions. If the question is unrelated, politely inform the user that you only handle medical queries. Question: ${userMessage}`;

  try {
    const response = await axios.post(
      API_URL,
      {
        prompt,
        model: "gemini-2.0-flash",
      },
      {
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiResponse = response.data.response || "Sorry, I couldn't process that.";
    res.json({ response: aiResponse });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ response: "Sorry, there was an error. Please try again." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
