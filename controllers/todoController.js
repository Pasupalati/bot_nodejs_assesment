const todoService = require('../services/todoService');

exports.createTodo = async (req, res) => {
    try {
        const result = await todoService.createTodo(req.body);
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getTodos = async (req, res) => {
    try {
        const result = await todoService.getTodos();
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getTodo = async (req, res) => {
    try {
        const result = await todoService.getTodo(req.params.id);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.updateTodo = async (req, res) => {
    try {
        const result = await todoService.updateTodo(req.params.id, req.body);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        const result = await todoService.deleteTodo(req.params.id);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
