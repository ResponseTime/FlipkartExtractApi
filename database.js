require("dotenv").config();
const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
client.connect((err) => {
  if (err) throw err;
});

const db = client.db("Test");
module.exports = db;
