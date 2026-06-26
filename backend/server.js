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

function provjeriToken(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ error: "Niste prijavljeni." });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Token nije valjan ili je istekao." });
  }
}

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

app.get("/api/orders", provjeriToken, async (req, res) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ orders: data });
});

app.post("/api/orders", provjeriToken, async (req, res) => {
  const { client_name, client_phone, title, description } = req.body;

  if (!client_name || !title) {
    return res.status(400).json({ error: "Klijent i naslov su obavezni." });
  }

  const code =
    "ST-" +
    new Date().getFullYear() +
    "-" +
    Math.floor(1000 + Math.random() * 9000);

  const { data, error } = await supabase
    .from("orders")
    .insert({
      code,
      client_name,
      client_phone: client_phone || null,
      title,
      description: description || null,
      assigned_to: req.user.username,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ order: data });
});

app.put("/api/orders/:id", provjeriToken, async (req, res) => {
  const id = req.params.id;

  const { data: trenutni, error: greska1 } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (greska1) return res.status(500).json({ error: greska1.message });
  if (!trenutni) return res.status(404).json({ error: "Nalog ne postoji." });

  const izmjene = {};
  const { client_name, client_phone, title, description, status } = req.body;

  if (client_name !== undefined) izmjene.client_name = client_name;
  if (client_phone !== undefined) izmjene.client_phone = client_phone;
  if (title !== undefined) izmjene.title = title;
  if (description !== undefined) izmjene.description = description;

  if (status && status !== trenutni.status) {
    izmjene.status = status;
    if (status === "u_tijeku" && !trenutni.started_at) {
      izmjene.started_at = new Date().toISOString();
    }
    if (status === "zavrseno") {
      izmjene.completed_at = new Date().toISOString();
    }
  }

  const { data, error } = await supabase
    .from("orders")
    .update(izmjene)
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ order: data });
});

app.delete("/api/orders/:id", provjeriToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Samo administrator moze brisati naloge." });
  }

  const { error } = await supabase
    .from("orders")
    .delete()
    .eq("id", req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true, message: "Nalog obrisan." });
});

app.post("/api/orders/:id/notes", provjeriToken, async (req, res) => {
  const { body } = req.body;
  if (!body) return res.status(400).json({ error: "Napomena je prazna." });

  const { data, error } = await supabase
    .from("notes")
    .insert({
      order_id: req.params.id,
      body: body,
      author: req.user.name || req.user.username,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ note: data });
});

app.get("/api/orders/:id/notes", provjeriToken, async (req, res) => {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("order_id", req.params.id)
    .order("created_at", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ notes: data });
});

app.listen(PORT, () => {
  console.log(`Server slusa na http://localhost:${PORT}`);
});
