const jwt = require("jsonwebtoken");
const { Users } = require("../models");
const ApiError = require("../utils/apiError");

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
      attributes: ["id", "full_name", "email", "phone_number", "user_status"],
    });

    if (!user) {
      return next(new ApiError("User not found", 400));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new ApiError(err.message, 500));
  }
};
