const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  // Accept token from x-auth-token, Authorization: Bearer <token>, or query string
  let token = req.header("x-auth-token") || req.query.token;
  if (!token && req.header("authorization")) {
    const authHeader = req.header("authorization");
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    } else {
      token = authHeader.trim();
    }
  }

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
}

/** Require req.user.role to be one of the allowed roles. Use after auth. */
function roleCheck(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Forbidden: insufficient role" });
    }
    next();
  };
}

module.exports = auth;
module.exports.roleCheck = roleCheck;
