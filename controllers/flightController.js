const { Flights, Seats, Airlines, Airports } = require("../models");
const ApiError = require("../utils/apiError");
const seatGenerator = require("../utils/seatGenerator");
const { Op } = require("sequelize");

const findFligths = async (req, res, next) => {
  try {
    const {
      searchDate,
      page,
      continent,
      deptAirport,
      arrAirport,
      limit,
      sortBy,
      order,
    } = req.query;

    const condition = {};

    // ?date=dd-mm-yyyy
    if (searchDate) {
      const [day, month, year] = searchDate.split("-");
      const specificDate = new Date(year, month - 1, day);
      const nextDate = new Date(specificDate);
      nextDate.setDate(specificDate.getDate() + 1);

      condition.departure_time = {
        [Op.gte]: specificDate,
        [Op.lt]: nextDate,
      };
    }

    if (deptAirport) {
      condition.departure_airport_id = deptAirport;
    }

    if (arrAirport) {
      condition.arrival_airport_id = arrAirport;
    }

    if (continent) {
      condition["$departureAirport.airport_continent$"] = continent;
    }

    const orderData = [];
    if (sortBy) {
      const sortOrder = order === "asc" ? "ASC" : "DESC";
      if (sortBy === "departureTime") {
        orderData.push(["departure_time", sortOrder]);
      } else if (sortBy === "price_economy") {
        orderData.push(["price_economy", sortOrder]);
      } else if (sortBy === "price_premium_economy") {
        orderData.push(["price_premium_economy", sortOrder]);
      } else if (sortBy === "price_business") {
        orderData.push(["price_business", sortOrder]);
      } else if (sortBy === "price_first_class") {
        orderData.push(["price_first_class", sortOrder]);
      }
    }

    const pageNum = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const offset = (pageNum - 1) * pageSize;

    const totalCount = await Flights.count({
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
      where: condition,
    });

    const flights = await Flights.findAll({
      limit: pageSize,
      offset: offset,
      order: orderData,
      attributes: [
        "id",
        "flight_number",
        "information",
        "departure_time",
        "arrival_time",
        "departure_airport_id",
        "departure_terminal",
        "arrival_airport_id",
        "price_economy",
        "price_premium_economy",
        "price_business",
        "price_first_class",
        "airline_id",
        "created_at",
        "updated_at",
      ],

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
      where: condition,
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    flights.forEach((flight) => {
      if (flight) {
        const deptTime = new Date(flight.departure_time);
        const arrTime = new Date(flight.arrival_time);
        const duration = (arrTime - deptTime) / 60000;
        const jam = Math.floor(duration / 60);
        const menit = duration % 60;
        const formattedDurasi = `${jam}h ${menit}m`;
        flight.dataValues.duration = formattedDurasi;
      } else {
        flight.dataValues.duration = "N/A";
      }
    });

    res.status(200).json({
      status: "Success",
      message: "Flights succesfully retrieved",
      requestAt: req.requestTime,
      pagination: {
        totalData: totalCount,
        totalPages,
        pageNum,
        pageSize,
      },
      data: {
        flights,
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
      airline_id,
    });

    // Bulk insert seat
    await Seats.bulkCreate(seatGenerator(newFlight.id));

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
