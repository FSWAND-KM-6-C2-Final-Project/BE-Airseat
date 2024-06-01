const ApiError = require("../utils/apiError");
const processBooking = require("../utils/processBooking");

const createBooking = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const booking = await processBooking(req.body, userId);
    res.status(201).json({
      status: "Success",
      message: "Booking is created successfully",
      data: booking,
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

module.exports = {
  createBooking,
};
