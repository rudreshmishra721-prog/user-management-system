const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Signup route
router.post('/signup', userController.signup);

// Login route
router.post('/login', userController.login);

// Create user (Protected)
router.post('/create', authMiddleware, userController.createUser);

// Protected route - get all users
router.get('/all', authMiddleware, userController.getAllUsers);

// Update user (Protected)
router.put('/update/:id', authMiddleware, userController.updateUser);

module.exports = router;


