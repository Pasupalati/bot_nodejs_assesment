const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getDb } = require('../config/dbConfig');

const createUser = async (req, res) => {
    const { username, email, password } = req.body;
    const db = getDb();

    try {
        const userExists = await db.collection('users').findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            username,
            email,
            password: hashedPassword
        };

        await db.collection('users').insertOne(newUser);
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user', details: err.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const db = getDb();

    try {
        const user = await db.collection('users').findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const payload = { id: user._id, username: user.username };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Logged in successfully', token });
    } catch (err) {
        res.status(500).json({ error: 'Failed to login', details: err.message });
    }
};

const getUser = async (req, res) => {
    const { id } = req.params;
    const db = getDb();

    try {
        const user = await db.collection('users').findOne({ _id: new require('mongodb').ObjectId(id) });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get user', details: err.message });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;
    const db = getDb();

    try {
        const updateFields = {};
        if (username) updateFields.username = username;
        if (email) updateFields.email = email;
        if (password) updateFields.password = await bcrypt.hash(password, 10);

        const result = await db.collection('users').updateOne(
            { _id: new require('mongodb').ObjectId(id) },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update user', details: err.message });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    const db = getDb();

    try {
        const result = await db.collection('users').deleteOne({ _id: new require('mongodb').ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete user', details: err.message });
    }
};

module.exports = { createUser, loginUser, getUser, updateUser, deleteUser };
