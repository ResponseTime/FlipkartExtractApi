require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./database.js");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const cheerio = require("cheerio");
const bcrypt = require("bcrypt");
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function auth(req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }

  jwt.verify(token, process.env.KEY, (err, decoded) => {
    if (err) {
      res.status(403).json({ error: "Invalid token" });
    }
    req.email = decoded.email;
    next();
  });
}

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    let collection = await db.collection("logdet");
    let user = await collection.findOne({ email });
    if (user) {
      res.status(400).json({ message: "user exists login" });
    }
    const salt = await bcrypt.genSalt();
    const encrytedPass = await bcrypt.hash(password, salt);
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
    let user = await collection.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "No user Found" });
    }
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      res.status(401).json({ message: "Password incorrect" });
      return;
    }
    const token = jwt.sign({ email }, process.env.KEY, { expiresIn: "24h" });
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
    let dataM = await collection.find({ email });
    for await (const key of dataM) {
      if (key.email === email && key.url === url) {
        res.status(400).json({ message: "Item already Scraped" });
        return;
      }
    }
    const response = await axios.get(url);
    const $ = await cheerio.load(response.data);
    const media = $("._3GnUWp li");
    let num = 0;
    media.each(() => {
      num++;
    });
    let dataIns = await collection.insertOne({
      email: email,
      url: url,
      Title: $(".B_NuCI").text(),
      Price: $("div._16Jk6d").text(),
      Desc: $("._1mXcCf").text().length > 0 ? $("._1mXcCf").text() : " ",
      NumOfRatingsAndReview: $("._2_R_DZ").first().text(),
      Ratings: $("._3LWZlK").first().text(), // $("._2d4LTz").text() || $("._138NNC").text()
      NumOfMedia: num,
    });
    if (dataIns.acknowledged === true) {
      res.json(dataIns);
    } else {
      res.json(dataIns);
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log("listening on 5000");
});
