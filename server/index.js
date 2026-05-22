import express from "express";import express from "app.use(express.json());

/* ✅ MOCK CHAT ENDPOINT (NO OPENAI) */
app.post("/chat", (req, res) => {
  const { message } = req.body;

  console.log("➡️ Incoming (mock):", message);

  // Simple friendly mock logic
  let reply = "💖 Mama Assistant: I'm here for you.";

  if (message.toLowerCase().includes("help")) {
    reply = "💖 Mama Assistant: Of course. Tell me what you need help with.";
  } else if (message.toLowerCase().includes("hello")) {
    reply = "💖 Mama Assistant: Hi! How can I support you today?";
  } else {
    reply = `💖 Mama Assistant: I hear you — "${message}"`;
  }

  res.json({ reply });
});

/* ✅ START SERVER */
app.listen(5000, () => {
  console.log("✅ Mock server running on http://localhost:5000");
});
import cors from "cors";

const app = express();

app.use(cors());
