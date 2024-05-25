const {
  Flights,
  Airlines,
  Airports,
  Booking_Details,
  Bookings,
  Discounts,
  Notifications,
  Passengers,
  Seats,
  Users,
} = require("../models");
const ApiError = require("../utils/ApiError");

const findFligths = async (req, res, next) => {
  try {
    const { FlightName, createdBy, manufacture, type, page, limit } = req.query;
    const condition = {};
    // Filter by carName
    if (FlightName) condition.model = { [Op.iLike]: `%${FlightName}%` };
    // Filter by createdBy
    if (createdBy) condition.createdBy = createdBy;
    // Filter by manufacture
    if (manufacture) condition.manufacture = { [Op.iLike]: `${manufacture}%` };
    // Filter by type
    if (type) condition.type = { [Op.iLike]: `%${type}%` };
    const pageNum = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const offset = (pageNum - 1) * pageSize;
    const totalCount = await Flights.count({ where: condition });
    const flights = await Flights.findAll({
      where: condition,
      limit: pageSize,
      offset: offset,
    });
    const totalPages = Math.ceil(totalCount / pageSize);
    res.status(200).json({
      status: "Success",
      message: "Flights succesfully retrieved",
      requestAt: req.requestTime,
      data: {
        flights,
      },
      pagination: {
        totalData: totalCount,
        totalPages,
        pageNum,
        pageSize,
      },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const findFlightById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const flight = await Flights.findOne({
      where: {
        id,
      },
    });

    if (!flight) {
      return next(new ApiError(`Flight with id '${id}' is not found`, 404));
    }

    res.status(200).json({
      status: "Success",
      message: "Flight succesfully retrieved",
      requestAt: req.requestTime,
      data: {
        flight,
      },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const updateFlight = async (req, res, next) => {
  const {
    flight_number,
    information,
    departure_time,
    arrival_time,
    departure_airport_id,
    departure_terminal,
    arrival_airport_id,
    price_economy,
    price_premium_economy,
    price_business,
    price_first_class,
    seat,
    airline_id,
  } = req.body;
  try {
    const id = req.params.id;
    const flight = await Flights.findOne({
      where: {
        id,
      },
    });
    if (!flight) {
      return next(new ApiError(`Flight with id '${id}' is not found`, 404));
    }
    await Flights.update(
      {
        flight_number,
        information,
        departure_time,
        arrival_time,
        departure_airport_id,
        departure_terminal,
        arrival_airport_id,
        price_economy,
        price_premium_economy,
        price_business,
        price_first_class,
        seat,
        airline_id,
      },
      {
        where: {
          id,
        },
      }
    );
    const updatedFlight = await Flights.findOne({
      where: {
        id,
      },
    });

    res.status(200).json({
      status: "Success",
      message: "Flight succesfully Update",
      requestAt: req.requestTime,
      data: {
        updatedFlight,
      },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const deleteFlight = async (req, res, next) => {
  try {
    const id = req.params.id;
    const flight = await Flights.findOne({
      where: {
        id,
      },
    });

    if (!flight) {
      next(new ApiError(`Flight with id '${id}' is not found`, 404));
    }
    await flight.destroy({
      where: {
        id,
      },
    });

    res.status(200).json({
      status: "Success",
      message: `Flight with id '${flight.id}' is successfully deleted`,
      requestAt: req.requestTime,
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const createFlight = async (req, res, next) => {
  const {
    flight_number,
    information,
    departure_time,
    arrival_time,
    departure_airport_id,
    departure_terminal,
    arrival_airport_id,
    price_economy,
    price_premium_economy,
    price_business,
    price_first_class,
    seat,
    airline_id,
  } = req.body;

  try {
    const newFlight = await Flights.create({
      flight_number,
      information,
      departure_time,
      arrival_time,
      departure_airport_id,
      departure_terminal,
      arrival_airport_id,
      price_economy,
      price_premium_economy,
      price_business,
      price_first_class,
      seat,
      airline_id,
    });

    res.status(200).json({
      status: "Success",
      message: "Flight successfully created",
      requestAt: req.requestTime,
      data: {
        newFlight,
      },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

module.exports = {
  findFligths,
  findFlightById,
  updateFlight,
  deleteFlight,
  createFlight,
};
