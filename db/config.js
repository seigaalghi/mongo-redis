const mongoose = require("mongoose");
const redis = require("redis");

module.exports = {
  mongoDB: () => {
    mongoose.connect(
      "mongodb+srv://admin:admin@cluster0.l4eoe.mongodb.net/laptopDB?retryWrites=true&w=majority",
      (err) => {
        if (err) throw err;
        console.log("Connected to mongoDB");
      }
    );
  },
  redis: () => {
    const client = redis.createClient({
      database: 2,
    });
    client.connect()
    client.on("error", (err) => console.log(error));
    return client;
  },
};
