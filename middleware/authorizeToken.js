const jwt = require("jsonwebtoken");
const secrets = require("../api/utils");

const authorizeToken = (req, res, next) => {
  const token = req.headers.Authorization; // MUST BE CAPITAL
  const secret = secrets.jwtSecret;

  console.log(token)

  if (token) {
    jwt.verify(token, secret, (error, decodedToken) => {
      if (error) {
        res.status(401).json({ message: 'valid Credentials' });
      } else {
        req.decodedToken = decodedToken;
        next();
      }
    });
  } else {
    res.status(400).json({ message: "Please provide credentials" });
  }
}

module.exports = authorizeToken;