require("dotenv").config();
const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const { data: user, error } = await supabase
    .from("app_users")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  if (!user)
    return res.status(401).json({ error: "Pogresno ime ili lozinka." });

  const ispravna = await bcrypt.compare(password, user.password_hash);
  if (!ispravna)
    return res.status(401).json({ error: "Pogresno ime ili lozinka." });

  const token = jwt.sign(
    { username: user.username, role: user.role, name: user.full_name },
    process.env.JWT_SECRET,
    { expiresIn: "12h" },
  );

  res.json({ token, role: user.role, name: user.full_name });
});

app.listen(PORT, () => {
  console.log(`Server slusa na http://localhost:${PORT}`);
});
