const ApiError = require("../utils/apiError");
const processBooking = require("../utils/processBooking");
const {
  Bookings,
  Booking_Details,
  Seats,
  Flights,
  Airports,
  Airlines,
} = require("../models");
const Sequelize = require("sequelize");
const axios = require("axios");

const getDetailBooking = async (req, res, next) => {
  try {
    const id = req.user.id;

    const booking = await Bookings.findAll({
      where: {
        user_id: id,
      },
      attributes: [
        "booking_code",
        "payment_method",
        "ordered_by_first_name",
        "ordered_by_last_name",
        "ordered_by_phone_number",
        "total_amount",
        "booking_status",
        "booking_expired",
        "created_at",
        [
          Sequelize.literal(
            'EXTRACT(EPOCH FROM ("flight"."arrival_time" - "flight"."departure_time")) / 60'
          ),
          "duration",
        ],
      ],

      include: [
        {
          model: Flights,
          attributes: [
            "flight_number",
            "information",
            "departure_time",
            "arrival_time",
            "departure_terminal",
          ],
          as: "flight",
          include: [
            {
              model: Airlines,
              as: "airline",
              attributes: ["airline_name", "airline_picture"],
            },
            {
              model: Airports,
              as: "departureAirport",
              attributes: [
                "airport_name",
                "airport_city",
                "airport_city_code",
                "airport_picture",
                "airport_continent",
              ],
            },
            {
              model: Airports,
              as: "arrivalAirport",
              attributes: [
                "airport_name",
                "airport_city",
                "airport_city_code",
                "airport_picture",
                "airport_continent",
              ],
            },
          ],
        },
        {
          model: Flights,
          attributes: [
            "flight_number",
            "information",
            "departure_time",
            "arrival_time",
            "departure_terminal",
          ],
          as: "returnFlight",
          include: [
            {
              model: Airlines,
              as: "airline",
              attributes: ["airline_name", "airline_picture"],
            },
            {
              model: Airports,
              as: "departureAirport",
              attributes: [
                "airport_name",
                "airport_city",
                "airport_city_code",
                "airport_picture",
                "airport_continent",
              ],
            },
            {
              model: Airports,
              as: "arrivalAirport",
              attributes: [
                "airport_name",
                "airport_city",
                "airport_city_code",
                "airport_picture",
                "airport_continent",
              ],
            },
          ],
        },
        {
          model: Booking_Details,
          as: "bookingDetail",
          attributes: ["price"],
          include: [
            {
              model: Seats,
              as: "seat",
              attributes: ["class", "seat_name"],
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    if (!booking) {
      return next(new ApiError("Booking not found", 404));
    }

    booking.forEach((bookingItem) => {
      const durasi = bookingItem.dataValues.duration;
      const jam = Math.floor(durasi / 60);
      const menit = durasi % 60;
      const formattedDurasi = `${jam}h ${menit}m`;
      bookingItem.dataValues.duration = formattedDurasi;
    });

    booking.forEach((bookingItem) => {
      const classes = bookingItem.bookingDetail
        .map((detail) => detail.seat.class)
        .join(", ");
      bookingItem.dataValues.class = classes;
    });

    res.status(200).json({
      status: "Success",
      message: "Booking data is successfully retrieved",
      requestAt: req.requestTime,
      data: {
        booking,
      },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

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
        // If status payment is success
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

        // Update seat to unavailbale
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
        // If status payment is not success
        const booking = await Bookings.update(
          {
            booking_status: "cancelled",
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

        // Update seat to available
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
        // If status payment is pending

        res.status(200).json({
          status: "Success",
          message: `Booking for ${order_id} Status is pending`,
        });
      } else {
        // If status payment is unexpected
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
  getDetailBooking,
};
