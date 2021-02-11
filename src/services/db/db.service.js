const mongo = require("mongoose");
mongo.Promise = global.Promise;

// Connect to Mongo
exports.connectToDb = () => {
  return new Promise((resolve, reject) => {
    mongo
      .connect("mongodb://localhost:27017/dbKinal", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((res) => {
        if (res) {
          resolve("Mongo Connected");
        }
      })
      .catch((err) => {
        if (err) {
          reject("Error connecting to mongo");
        }
      });
  });
};
