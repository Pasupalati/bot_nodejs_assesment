const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGO_URI;
let db;

const connectToDatabase = async () => {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    db = client.db();
    console.log('MongoDB connected');
};

const getDb = () => {
    if (!db) {
        throw new Error('Database not connected');
    }
    return db;
};

module.exports = { connectToDatabase, getDb };
