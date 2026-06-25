const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Server radi" });
});

app.listen(PORT, () => {
  console.log(`Server slusa na http://localhost:${PORT}`);
});
