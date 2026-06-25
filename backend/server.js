require("dotenv").config();
const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = 3000;

app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET,
);

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Server radi" });
});

app.listen(PORT, () => {
  console.log(`Server slusa na http://localhost:${PORT}`);
});
