require("dotenv").config();
const bcrypt = require("bcryptjs");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET,
);

async function seed() {
  const users = [
    {
      username: "admin",
      full_name: "Administrator",
      role: "admin",
      password: "admin123",
    },
    {
      username: "serviser",
      full_name: "Serviser",
      role: "serviser",
      password: "serviser123",
    },
  ];

  for (const u of users) {
    const password_hash = await bcrypt.hash(u.password, 10);

    const { error } = await supabase.from("app_users").insert({
      username: u.username,
      full_name: u.full_name,
      role: u.role,
      password_hash: password_hash,
    });

    if (error) {
      console.log(`Greska za ${u.username}:`, error.message);
    } else {
      console.log(`Dodan korisnik: ${u.username}`);
    }
  }
}

seed();
