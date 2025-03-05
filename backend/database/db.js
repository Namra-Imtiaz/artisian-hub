require('dotenv').config();
const mongoose = require("mongoose");

class Database {
  constructor() {
    this.connection = null;
  }

  async connectToDB() {
    if (this.connection) {
      console.log('Using existing database connection.');
      return this.connection;
    }

    try {
      this.connection = await mongoose.connect(
        "mongodb+srv://namraimtiaz04:sadiazafar@cluster0.rmz43.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
        { useNewUrlParser: true, useUnifiedTopology: true }
      );
      console.log('Connected to DB');
      return this.connection;
    } catch (error) {
      console.error('Error connecting to DB:', error);
      throw error;
    }
  }
}

// Exporting a single instance of the Database class
module.exports = new Database();
