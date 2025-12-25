const express = require('express');
const router = express.Router();

// controllers
const userController = require('../controllers/userController');

// middlewares
const authMiddleware = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

// PUBLIC ROUTES
router.post('/signup', userController.signup);
router.post('/login', userController.login);

// PROTECTED ROUTES
router.get('/all', authMiddleware, userController.getAllUsers);
router.put('/update/:id', authMiddleware, userController.updateUser);

// ADMIN ONLY ROUTES
router.post('/create', authMiddleware, isAdmin, userController.createUser);
router.delete('/delete/:id', authMiddleware, isAdmin, userController.deleteUser);

module.exports = router;
