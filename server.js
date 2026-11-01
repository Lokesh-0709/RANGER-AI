
import express from "express";
import OpenAI from "openai";

const app = express();

app.use(express.json({ limit: "10kb" }));

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
    res.send("RANGER AI Backend is running!");
});

app.post("/api/chat", async (req, res) => {
    try {
        const message = req.body.message;

        if (!message || typeof message !== "string" ||
            message.trim().length === 0) {
            return res.status(400).json({
                error: "Please enter a message."
            });
        }

        if (message.length > 4000) {
            return res.status(400).json({
                error: "Message is too long."
            });
        }

        const response = await openai.responses.create({
          model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
          instruction:
                "You are RANGER AI, a helpful assistant. " +
                "Answer clearly and support Tamil and English.",
            input: message.trim()
        });

        res.json({
            reply: response.output_text
        });

    } catch (error) {
        console.error("AI request failed:", error.message);

        res.status(500).json({
            error: "AI service is temporarily unavailable."
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("RANGER AI server running on port " + PORT);
});
