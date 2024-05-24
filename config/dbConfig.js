const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

let db;

const connectToDatabase = async () => {
    if (db) {
        return db;
    }

    const client = new MongoClient(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        tls: true,  // Enable TLS/SSL
        tlsAllowInvalidCertificates: false,  // Adjust if your server uses self-signed certificates
        tlsAllowInvalidHostnames: false  // Adjust if your server uses self-signed certificates
    });

    try {
        await client.connect();
        db = client.db();
        console.log('Connected to MongoDB');
        return db;
    } catch (err) {
        console.error('Failed to connect to the database', err);
        throw err;
    }
};

const getDb = () => {
    if (!db) {
        throw new Error('Database not initialized. Call connectToDatabase first.');
    }
    return db;
};

module.exports = { connectToDatabase, getDb };
