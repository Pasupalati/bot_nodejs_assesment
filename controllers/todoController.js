const { getDb } = require('../config/dbConfig');
const { ObjectId } = require('mongodb');

const createTodo = async (req, res) => {
    const { title, description, completed } = req.body;
    const db = getDb();

    try {
        const newTodo = {
            title,
            description: description || '',
            completed: completed || false,
            userId: req.user.id
        };

        await db.collection('todos').insertOne(newTodo);
        res.status(201).json({ message: 'Todo created successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create todo', details: err.message });
    }
};

const getTodos = async (req, res) => {
    const db = getDb();

    try {
        const todos = await db.collection('todos').find({ userId: req.user.id }).toArray();
        res.status(200).json(todos);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get todos', details: err.message });
    }
};

const getTodoById = async (req, res) => {
    const { id } = req.params;
    const db = getDb();

    try {
        const todo = await db.collection('todos').findOne({ _id: new ObjectId(id), userId: req.user.id });
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.status(200).json(todo);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get todo', details: err.message });
    }
};

const updateTodo = async (req, res) => {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    const db = getDb();

    try {
        const updateFields = {};
        if (title) updateFields.title = title;
        if (description) updateFields.description = description;
        if (completed !== undefined) updateFields.completed = completed;

        const result = await db.collection('todos').updateOne(
            { _id: new ObjectId(id), userId: req.user.id },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        res.status(200).json({ message: 'Todo updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update todo', details: err.message });
    }
};

const deleteTodo = async (req, res) => {
    const { id } = req.params;
    const db = getDb();

    try {
        const result = await db.collection('todos').deleteOne({ _id: new ObjectId(id), userId: req.user.id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete todo', details: err.message });
    }
};

module.exports = { createTodo, getTodos, getTodoById, updateTodo, deleteTodo };
