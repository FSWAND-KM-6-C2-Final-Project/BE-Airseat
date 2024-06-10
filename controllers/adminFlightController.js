const { Flights, Airlines, Airports, Seats } = require("../models");
const seatGenerator = require("../utils/seatGenerator");

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
      message: req.flash("message", ""),
      alertType: req.flash("alertType", ""),
    });
  } catch (err) {
    res.render("error", {
      title: "Error",
      message: err.message,
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
    });
  } catch (err) {
    res.render("error", {
      title: "Error",
      message: err.message,
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
    });
  }
};

module.exports = {
  listFlight,
  createFlightPage,
  insertFlight,
};
