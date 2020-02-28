const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = process.env;

module.exports = function(req, res, next) {
  // Get Token from header
  const token = req.header("x-auth-token");
  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: " No Token authorization denied" });
  }
  try {
    const decode = jwt.verify(token, TOKEN_SECRET);
    req.user = decode.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
