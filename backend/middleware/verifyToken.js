const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function verifyToken(request, response, next) {
  // ⚠️ DEVELOPMENT MODE: Authentication temporarily disabled
  // To re-enable authentication, uncomment the code below and comment these lines
  console.log('🔓 Backend authentication bypassed for development mode');
  request.user = { id: 1, email: 'dev@admin.com' }; // Mock user for development
  return next();

  // Original token verification code (commented out):
  /*
  const token = request.headers["authorization"]?.split(" ")[1];
  if (!token) return response.status(403).json({ msg: "No token provided" });

  jwt.verify(token, JWT_SECRET, (error, decoded) => {
    if (error) return response.status(401).json({ msg: "Unauthorized" });
    request.user = decoded;
    next();
  });
  */
}

module.exports = verifyToken;
