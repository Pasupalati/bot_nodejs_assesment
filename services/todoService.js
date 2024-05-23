const { getDb } = require('../config/dbConfig');
const { ObjectId } = require('mongodb');

const COLLECTION_NAME = 'todos';

exports.createTodo = async (todoData) => {
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).insertOne(todoData);
    return result.ops[0];
};

exports.getTodos = async () => {
    const db = getDb();
    const todos = await db.collection(COLLECTION_NAME).find().toArray();
    return todos;
};

exports.getTodo = async (id) => {
    const db = getDb();
    const todo = await db.collection(COLLECTION_NAME).findOne({ _id: ObjectId(id) });
    return todo;
};

exports.updateTodo = async (id, todoData) => {
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).updateOne({ _id: ObjectId(id) }, { $set: todoData });
    return result.modifiedCount > 0 ? todoData : null;
};

exports.deleteTodo = async (id) => {
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: ObjectId(id) });
    return result.deletedCount > 0;
};
