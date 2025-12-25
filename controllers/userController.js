const db = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.signup = (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const userRole = "user";

    const hashedPassword = bcrypt.hashSync(password, 10);

    const query = `
        INSERT INTO users (name, email, password, role)
        VALUES (?, ?, ?, ?)
    `;

    db.run(query, [name, email, hashedPassword, userRole], function (err) {
        if (err) {
            return res.status(500).json({ message: "User already exists or DB error" });
        }

        res.status(201).json({
            message: "User created successfully",
            role: userRole
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
         {
         id: user.id,
           email: user.email,
         role: user.role
         },
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

exports.updateUser = (req, res) => {
    const userId = req.params.id;
    const { name, email, password } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required" });
    }

    let query = "";
    let params = [];

    if (password) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        query = `UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?`;
        params = [name, email, hashedPassword, userId];
    } else {
        query = `UPDATE users SET name = ?, email = ? WHERE id = ?`;
        params = [name, email, userId];
    }

    db.run(query, params, function (err) {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User updated successfully" });
    });
};

exports.deleteUser = (req, res) => {
    const userId = req.params.id;

    const query = `DELETE FROM users WHERE id = ?`;

    db.run(query, [userId], function (err) {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User deleted successfully" });
    });
};

exports.createAdmin = (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const query = `
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, 'admin')
  `;

  db.run(query, [name, email, hashedPassword], function (err) {
    if (err) {
      return res.status(500).json({ message: "Admin creation failed" });
    }
    res.status(201).json({ message: "Admin created successfully" });
  });
};




