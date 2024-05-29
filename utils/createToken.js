const jwt = require("jsonwebtoken");

function createToken(user) {
  const payload = {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
}

module.exports = createToken;
