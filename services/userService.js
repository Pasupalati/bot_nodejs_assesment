const { getDb } = require('../config/dbConfig');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const COLLECTION_NAME = 'users';

exports.register = async (userData) => {
    const db = getDb();
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    const result = await db.collection(COLLECTION_NAME).insertOne(userData);
    return result.ops[0];
};

exports.login = async (loginData) => {
    const db = getDb();
    const user = await db.collection(COLLECTION_NAME).findOne({ email: loginData.email });
    if (user && await bcrypt.compare(loginData.password, user.password)) {
        const payload = { id: user._id, email: user.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        return { token: `Bearer ${token}`, user };
    } else {
        throw new Error('Invalid email or password');
    }
};

exports.getUser = async (id) => {
    const db = getDb();
    const user = await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
    return user;
};

exports.updateUser = async (id, userData) => {
    const db = getDb();
    if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
    }
    const result = await db.collection(COLLECTION_NAME).updateOne({ _id: new ObjectId(id) }, { $set: userData });
    return result.modifiedCount > 0 ? userData : null;
};

exports.deleteUser = async (id) => {
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
};
