const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    // 1. Read Authorization header
    const authHeader = req.headers.authorization;

    // 2. If header not present
    if (!authHeader) {
        return res.status(401).json({
            message: "Access denied. No token provided."
        });
    }

    // 3. Header format must be: Bearer TOKEN
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({
            message: "Invalid token format."
        });
    }

    const token = parts[1];

    // 4. Verify token
    try {
        const decoded = jwt.verify(token, "secretkey");

        // 5. Attach user info to request
        req.user = decoded;

        // 6. Allow request to continue
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token."
        });
    }
};

module.exports = authMiddleware;
