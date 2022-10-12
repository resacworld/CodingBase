const mongoose = require('mongoose');

const dbConnect = () => {

  // MongoDb
    mongoose.connect(`mongodb://localhost:27017/projects`,{
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => {
      console.log("DB connection alive");
    });
    return db
  }

module.exports = { dbConnect }