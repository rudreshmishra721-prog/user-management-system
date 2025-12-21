const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Signup route
router.post('/signup', userController.signup);

// Login route
router.post('/login', userController.login);

// Protected route - get all users
router.get('/all', authMiddleware, userController.getAllUsers);

module.exports = router;


