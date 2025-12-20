const db = require('../models/userModel');
const bcrypt = require('bcryptjs');

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
