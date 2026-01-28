const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "FFGLORY_SECRET";

app.get("/", (req, res) => {
  res.send("API running");
});

app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "erix2" && password === "96093811") {
    const token = jwt.sign(
      { username: "erix2", isAdmin: true },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    return res.json({ token });
  }
  res.status(401).json({ message: "Invalid login" });
});

function auth(req, res, next) {
  const h = req.headers.authorization || "";
  const t = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!t) return res.sendStatus(401);
  try {
    req.user = jwt.verify(t, JWT_SECRET);
    next();
  } catch {
    res.sendStatus(401);
  }
}

app.get("/api/auth/me", auth, (req, res) => {
  res.json({
    user: {
      username: req.user.username,
      isAdmin: true,
      basicCredits: 0,
      premiumCredits: 0
    }
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server running on", PORT));
