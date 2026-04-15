const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Support both "Bearer <token>" and raw token
  const authHeader = req.header("Authorization");

  if (!authHeader)
    return res.status(401).json({ message: "No token, access denied" });

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  if (!token) {
    return res.status(401).json({ message: "No token, access denied" });
  } 

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, please login again" });
    }
    res.status(400).json({ message: "Invalid token" });
  }
};
 