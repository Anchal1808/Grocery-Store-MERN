const jwt = require("jsonwebtoken");

const authUser = async (req, res, next) => {
  try {
    let token = req.headers.authorization || req.headers.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized. Please login again." });
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7).trim();
    }

    const secret = process.env.JWT_SECRET || "grocery_store_mern_default_jwt_secret_key";
    const decoded = jwt.verify(token, secret);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token. Please login again." });
  }
};

module.exports = authUser;
