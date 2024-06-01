const ApiError = require("../utils/apiError");

const createBooking = async (req, res, next) => {
  try {
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

module.exports = {
  createBooking,
};
