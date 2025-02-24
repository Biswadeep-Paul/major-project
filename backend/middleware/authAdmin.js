import jwt from "jsonwebtoken";

// Admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        const { atoken } = req.headers;

        // Check if token exists
        if (!atoken) {
            return res.status(401).json({ success: false, message: 'Not Authorized. Please log in again.' });
        }

        // Verify token
        const decoded = jwt.verify(atoken, process.env.JWT_SECRET);

        // Validate admin credentials from token payload
        if (decoded.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({ success: false, message: 'Invalid Admin Credentials.' });
        }

        // Proceed to the next middleware
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ success: false, message: 'Token verification failed.' });
    }
};

export default authAdmin;
