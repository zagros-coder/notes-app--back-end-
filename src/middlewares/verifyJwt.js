import jwt from "jsonwebtoken"; // Import the jsonwebtoken library
import dotenv from "dotenv"; // Import dotenv to manage environment variables       
dotenv.config(); // Load environment variables from .env file
const SECRET_KEY = process.env.SECRET_KEY;
 // Use the same secret key as in the login route

export const verifyUserToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(403).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Verify token
    // Ensure the decoded token contains an id
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Invalid token payload." });
    }
    req.user = decoded; // Attach user data to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};


export const verifyAdminToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(403).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Verify token
    // Ensure the decoded token contains an isAdmin property
    if (!decoded || decoded.is_admin !== true) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    req.user = decoded; // Attach user data to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export const verifyModeratorToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(403).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY); // Verify token
    // Ensure the decoded token contains an isModerator property
    if (!decoded || decoded.is_moderator !== true) {
      return res.status(403).json({ message: "Access denied. Moderators only." });
    }
    req.user = decoded; // Attach user data to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}