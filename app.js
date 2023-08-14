require("dotenv").config();
const express = require("express");
const app = express();
const { db } = require("./database.js");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const cheerio = require("cheerio");
const port = process.env.PORT || 3000;
const KEY = process.env.KEY;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const auth = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }
  jwt.verify(token, KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.email = decoded.email;
    next();
  });
};

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    let collection = await db.collection("logdet");
    let user = await collection.findOne({ email });
    if (user) {
      res.status(400).json({ message: "user exists login" });
    }
    let encrytedPass = bcrypt.hash(password, 10);
    let newIns = await collection.insertOne({
      email: email,
      password: encrytedPass,
    });

    if (newIns.acknowledged == true) {
      res.status(201).json({ message: "user created" });
    } else {
      res.status(500).json({ message: "some error occured" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let collection = await db.collection("logdet");
    let user = collection.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "No user Found" });
    }
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      res.status(401).json({ message: "Password incorrect" });
    }
    const token = jwt.sign({ email }, KEY, { expiresIn: "24h" });
    res.json(token);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/scrape", auth, async (req, res) => {
  const { url } = req.body;
  const email = req.email;
  try {
    let collection = await db.collection("Data");
    let dataM = await collection.findOne({ email });
    dataM.forEach((element) => {
      if (element.url === url) {
        res.json("Already Scraped this link");
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.listen(port, () => {
  console.log("listening on 5000");
});
