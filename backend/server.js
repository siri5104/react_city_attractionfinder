import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.get("/cities/:city_name/attractions", async (req, res) => {
  const cityName = req.params.city_name;

  try {
    const response = await fetch(
      "http://127.0.0.1:7860/api/v1/run/eaea3378-4b11-4182-ba14-cb41c9446dc4?stream=false",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "YOUR_API_KEY_HERE",
        },
        body: JSON.stringify({
          input_value: cityName,
          output_type: "chat",
          input_type: "chat",
          tweaks: {
            "ChatInput-q0Jd4": {},
            "Prompt-uIDt8": {},
            "ChatOutput-qt69r": {},
            "OpenAIModel-2gEnN": {},
          },
        }),
      }
    );

    const data = await response.json();

    // ✅ Extract attractions from the response text
    const messageText = data.outputs?.[0]?.outputs?.[0]?.outputs?.message?.message?.text;

    if (messageText) {
      const attractionsArray = [...messageText.matchAll(/\*\*(.*?)\*\*\:\s*(.*?)(?=\d+\.\s|\n*$)/gs)]
        .map(match => ({ name: match[1], description: match[2].trim() }));

      res.json({ attractions: attractionsArray });
    } else {
      res.status(500).json({ error: "Unexpected response structure from Langflow API" });
    }
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch attractions" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
