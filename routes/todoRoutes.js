const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { createTodo, getTodos, getTodoById, updateTodo, deleteTodo } = require('../controllers/todoController');
const passport = require('passport');
const router = express.Router();

// Middleware to handle validation results
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Create Todo
router.post(
    '/',
    [
        body('title').isString().notEmpty().withMessage('Title is required'),
        body('description').optional().isString().withMessage('Description must be a string'),
        body('completed').optional().isBoolean().withMessage('Completed must be a boolean')
    ],
    handleValidationErrors,
    createTodo
);

// Get All Todos
router.get(
    '/',
    getTodos
);

// Get Todo by ID
router.get(
    '/:id',
    [
        param('id').isMongoId().withMessage('Invalid Todo ID')
    ],
    handleValidationErrors,
    getTodoById
);

// Update Todo by ID
router.put(
    '/:id',
    [
        param('id').isMongoId().withMessage('Invalid Todo ID'),
        body('title').optional().isString().withMessage('Title must be a string'),
        body('description').optional().isString().withMessage('Description must be a string'),
        body('completed').optional().isBoolean().withMessage('Completed must be a boolean')
    ],
    handleValidationErrors,
    updateTodo
);

// Delete Todo by ID
router.delete(
    '/:id',
    [
        param('id').isMongoId().withMessage('Invalid Todo ID')
    ],
    handleValidationErrors,
    deleteTodo
);

module.exports = router;
