// NOTE: The Firebase client SDK cannot verify ID tokens on the server.
// For development, we'll mock authentication. In production, use a proper auth service or switch back to admin SDK.

async function authenticateToken(req, res, next) {
  // Mock user for development
  req.user = {
    uid: "mockUserId",
    name: "Mock User",
    email: "mock@example.com",
  };
  next();
}

module.exports = authenticateToken;
