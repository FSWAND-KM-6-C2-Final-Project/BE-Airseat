const ApiError = require("../utils/apiError");
const processBooking = require("../utils/processBooking");
const { Bookings, Booking_Details, Seats } = require("../models");
const axios = require("axios");
const { Op } = require("sequelize");

const createBooking = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return next(new ApiError("Booking error, Please login!", 400));
    }

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

const updateBookingStatus = async (req, res, next) => {
  try {
    const { transaction_status, order_id } = req.body;

    if (transaction_status) {
      if (
        transaction_status === "capture" ||
        transaction_status === "settlement"
      ) {
        const booking = await Bookings.update(
          {
            booking_status: "issued",
          },
          {
            where: {
              booking_code: order_id,
            },
          }
        );

        if (!booking) {
          return next(new ApiError("Booking not found", 404));
        }

        const getBookingId = await Bookings.findOne({
          where: {
            booking_code: order_id,
          },
        });

        const bookingDetails = await Booking_Details.findAll({
          where: {
            booking_id: getBookingId.id,
          },
        });

        const seatIds = await bookingDetails.map((detail) => detail.seat_id);

        // Ubah seat jadi unavailbale
        await Seats.update(
          {
            seat_status: "unavailable",
          },
          {
            where: { id: seatIds },
          }
        );

        res.status(200).json({
          status: "Success",
          message: `Booking for ${order_id} Status is successfully issued`,
          requestAt: req.requestTime,
        });
      } else if (
        transaction_status === "deny" ||
        transaction_status === "expire" ||
        transaction_status === "cancel" ||
        transaction_status === "expire" ||
        transaction_status === "failure"
      ) {
        const booking = await Bookings.update(
          {
            booking_status: "issued",
          },
          {
            where: {
              booking_code: order_id,
            },
          }
        );

        if (!booking) {
          return next(new ApiError("Booking not found", 404));
        }

        const getBookingId = await Bookings.findOne({
          where: {
            booking_code: order_id,
          },
        });

        const bookingDetails = await Booking_Details.findAll({
          where: {
            booking_id: getBookingId.id,
          },
        });

        const seatIds = await bookingDetails.map((detail) => detail.seat_id);

        // Ubah seat jadi available
        await Seats.update(
          {
            seat_status: "available",
          },
          {
            where: { id: seatIds },
          }
        );

        res.status(200).json({
          status: "Success",
          message: `Booking for ${order_id} Status is successfully canceled`,
          requestAt: req.requestTime,
        });
      } else if (transaction_status === "pending") {
        res.status(200).json({
          status: "Success",
          message: `Booking for ${order_id} Status is pending`,
        });
      } else {
        throw new Error("No status");
      }
    }
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const getPaymentStatus = async (req, res, next) => {
  try {
    const { bookingCode } = req.params;

    const booking = await Bookings.findOne({
      where: {
        booking_code: bookingCode,
      },
    });

    if (!booking) {
      return next(new ApiError("Booking code not found", 404));
    }

    const encodedServerKey = Buffer.from(
      process.env.MIDTRANS_SERVER_KEY + ":"
    ).toString("base64");

    const options = {
      method: "GET",
      url: `https://api.sandbox.midtrans.com/v2/${bookingCode}/status`,
      headers: {
        accept: "application/json",
        authorization: `Basic ${encodedServerKey}`,
      },
    };

    const response = await axios.request(options);

    res.status(200).json({
      status: "Success",
      message: "Transaction status retrieved",
      requestAt: req.requestTime,
      data: {
        transaction_status: response.data,
      },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

module.exports = {
  createBooking,
  getPaymentStatus,
  updateBookingStatus,
};
