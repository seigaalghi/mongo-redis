const express = require("express");
const { redis } = require("./db/config");
const app = express();
const port = 5000;
const db = require("./db/config");
const Movies = require("./models/movies");
db.mongoDB();
const redisClient = db.redis();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/movie", async (req, res) => {
  const { body } = req;
  try {
    const movie = await Movies.create(body);
    res.status(201).json({
      status: "ok",
      result: movie,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
});

app.get("/movie", async (req, res) => {
  try {
    let cache = true;
    let movies = await redisClient.get("latestMovie");
    movies = JSON.parse(movies);
    if (!movies) {
      cache = false;
      movies = await Movies.find().limit(10).sort({ createdAt: "-1" });
      redisClient.set("latestMovie", JSON.stringify(movies));
    }
    res.status(200).json({
      status: "ok",
      result: movies,
      cache: cache,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
});

app.listen(port, () => console.log("Server is running on port", port));
