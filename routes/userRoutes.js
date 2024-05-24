const express = require('express');
const { body, validationResult } = require('express-validator');
const { createUser, loginUser, getUser, updateUser, deleteUser } = require('../controllers/userController');
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

// Register User
router.post(
    '/register',
    [
        body('username').isString().notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Email is invalid'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ],
    handleValidationErrors,
    createUser
);

// Login User
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Email is invalid'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    handleValidationErrors,
    loginUser
);

// Get User by ID
router.get(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    getUser
);

// Update User by ID
router.put(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    [
        body('username').optional().isString().withMessage('Username must be a string'),
        body('email').optional().isEmail().withMessage('Email is invalid'),
        body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ],
    handleValidationErrors,
    updateUser
);

// Delete User by ID
router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    deleteUser
);

module.exports = router;
