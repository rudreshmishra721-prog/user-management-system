const db = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.signup = (req, res) => {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const checkUserQuery = `SELECT * FROM users WHERE email = ?`;

    db.get(checkUserQuery, [email], (err, row) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        if (row) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Insert new user
        const insertUserQuery = `
            INSERT INTO users (name, email, password)
            VALUES (?, ?, ?)
        `;

        db.run(insertUserQuery, [name, email, hashedPassword], function (err) {
            if (err) {
                return res.status(500).json({ message: "Error creating user" });
            }

            return res.status(201).json({
                message: "User registered successfully",
                userId: this.lastID
            });
        });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const findUserQuery = `SELECT * FROM users WHERE email = ?`;

    db.get(findUserQuery, [email], (err, user) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare password with hashed password
        const isMatch = bcrypt.compareSync(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            "secretkey",
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Login successful",
            token: token
        });
    });
};

exports.createUser = (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const query = `
        INSERT INTO users (name, email, password)
        VALUES (?, ?, ?)
    `;

    db.run(query, [name, email, hashedPassword], function (err) {
        if (err) {
            return res.status(500).json({ message: "Error creating user" });
        }

        return res.status(201).json({
            message: "User created successfully",
            userId: this.lastID
        });
    });
};

exports.getAllUsers = (req, res) => {
    const query = `SELECT id, name, email FROM users`;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        return res.status(200).json(rows);
    });
};



