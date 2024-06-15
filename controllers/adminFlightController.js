const { Flights, Airlines, Airports, Seats } = require("../models");
const seatGenerator = require("../utils/seatGenerator");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

const listFlight = async (req, res, next) => {
  try {
    const flight = await Flights.findAll({
      order: [["created_at", "DESC"]],
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

    res.render("flight/list", {
      title: "Flight",
      flights: flight,
      name: req.session.name,
      message: req.flash("message", ""),
      alertType: req.flash("alertType", ""),
    });
  } catch (err) {
    res.render("error", {
      title: "Error",
      message: err.message,
      name: req.session.name,
    });
  }
};

const createFlightPage = async (req, res, next) => {
  try {
    const airline = await Airlines.findAll({
      order: [["airline_name", "ASC"]],
    });

    const airport = await Airports.findAll({
      order: [["airport_name", "ASC"]],
    });

    res.render("flight/create", {
      title: "Flight",
      airlines: airline,
      airports: airport,
      name: req.session.name,
    });
  } catch (err) {
    res.render("error", {
      title: "Error",
      message: err.message,
      name: req.session.name,
    });
  }
};

const insertFlight = async (req, res, next) => {
  try {
    const {
      airline_id,
      flight_number,
      information,
      departure_airport_id,
      departure_terminal,
      arrival_airport_id,
      departure_time,
      arrival_time,
      price_economy,
      price_premium_economy,
      price_business,
      price_first_class,
    } = req.body;

    const departureTimeISO = new Date(departure_time).toISOString();
    const arrivalTimeISO = new Date(arrival_time).toISOString();

    const newFlight = await Flights.create({
      airline_id,
      flight_number,
      information,
      departure_airport_id,
      departure_terminal,
      arrival_airport_id,
      departure_time: departureTimeISO,
      arrival_time: arrivalTimeISO,
      price_economy,
      price_premium_economy,
      price_business,
      price_first_class,
    });

    await Seats.bulkCreate(seatGenerator(newFlight.id));

    req.flash("message", "Saved");
    req.flash("alertType", "success");
    res.redirect("/admin/flight/list");
  } catch (err) {
    res.render("error", {
      title: "Error",
      message: err.message,
      name: req.session.name,
    });
  }
};

const deleteFlight = async (req, res, next) => {
  try {
    const id = req.params.id;

    const flight = await Flights.findOne({
      where: {
        id: id,
      },
    });

    if (!flight) {
      return new Error("Not found flight data");
    }

    // Delete flight data
    await Flights.destroy({
      where: {
        id: id,
      },
    });

    // Delete seat by flight_id
    await Seats.destroy({
      where: {
        flight_id: id,
      },
    });

    req.flash("message", "Deleted");
    req.flash("alertType", "dark");
    res.redirect("/admin/flight/list");
  } catch (err) {
    res.render("error", {
      title: "Error",
      message: err.message,
      name: req.session.name,
    });
  }
};

const editFlightPage = async (req, res, next) => {
  try {
    const id = req.params.id;

    const flight = await Flights.findOne({
      where: {
        id,
      },
    });

    const formattedDepartureTime = dayjs(flight.departure_time)
      .tz("Asia/Jakarta")
      .format("YYYY-MM-DDTHH:mm");

    const formattedArrivalTime = dayjs(flight.arrival_time)
      .tz("Asia/Jakarta")
      .format("YYYY-MM-DDTHH:mm");

    if (!flight) {
      return new Error("Not found flight data");
    }

    const airline = await Airlines.findAll({
      order: [["airline_name", "ASC"]],
    });

    const airport = await Airports.findAll({
      order: [["airport_name", "ASC"]],
    });

    res.render("flight/edit", {
      title: "Flight",
      flight: {
        ...flight.dataValues,
        formattedDepartureTime,
        formattedArrivalTime,
      },
      name: req.session.name,
      airlines: airline,
      airports: airport,
    });
  } catch (err) {
    res.render("error", {
      title: "Error",
      message: err.message,
      name: req.session.name,
    });
  }
};

const updateFlight = async (req, res, next) => {
  try {
    const id = req.params.id;

    const {
      airline_id,
      flight_number,
      information,
      departure_airport_id,
      departure_terminal,
      arrival_airport_id,
      departure_time,
      arrival_time,
      price_economy,
      price_premium_economy,
      price_business,
      price_first_class,
    } = req.body;

    const flight = await Flights.findOne({
      where: {
        id,
      },
    });

    if (!flight) {
      return new Error("Not found flight data");
    }

    await Flights.update(
      {
        airline_id,
        flight_number,
        information,
        departure_airport_id,
        departure_terminal,
        arrival_airport_id,
        departure_time,
        arrival_time,
        price_economy,
        price_premium_economy,
        price_business,
        price_first_class,
      },
      {
        where: {
          id,
        },
      }
    );

    req.flash("message", "Updated");
    req.flash("alertType", "primary");
    res.redirect("/admin/flight/list");
  } catch (err) {
    res.render("error", {
      title: "Error",
      message: err.message,
      name: req.session.name,
    });
  }
};

module.exports = {
  listFlight,
  createFlightPage,
  insertFlight,
  deleteFlight,
  editFlightPage,
  updateFlight,
};
