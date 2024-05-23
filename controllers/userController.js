const userService = require('../services/userService');

exports.register = async (req, res) => {
    try {
        const result = await userService.register(req.body);
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.login = async (req, res) => {
    try {
        const result = await userService.login(req.body);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getUser = async (req, res) => {
    try {
        const result = await userService.getUser(req.params.id);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.updateUser = async (req, res) => {
    try {
        const result = await userService.updateUser(req.params.id, req.body);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const result = await userService.deleteUser(req.params.id);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
