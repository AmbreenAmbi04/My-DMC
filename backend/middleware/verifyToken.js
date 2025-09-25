const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function verifyToken(request, response, next) {
    const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(403).json({ msg: "No token provided" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ msg: "Unauthorized" });
    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;
