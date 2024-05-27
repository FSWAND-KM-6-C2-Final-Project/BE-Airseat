const jwt = require("jsonwebtoken");
const { Users } = require("../models");
const ApiError = require("../utils/ApiError");

module.exports = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
      next(new ApiError("Token not found!", 401));
      return;
    }

    const token = bearerToken.split("Bearer ")[1];

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Users.findOne({
      where: {
        id: payload.id,
        email: payload.email,
      },
      attributes: [
        "id",
        "google_id",
        "first_name",
        "last_name",
        "email",
        "phone_number",
        "auth_type",
      ],
    });

    req.user = user;
    next();
  } catch (err) {
    return next(new ApiError(err.message, 500));
  }
};
