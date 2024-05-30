const { Seats } = require("../models");
const ApiError = require("../utils/apiError");
const exampleSeats = require("../data/seat.json");
const { Op } = require("sequelize");
const { isInt } = require("validator");

const findSeats = async (req, res, next) => {
  try {
    const { SeatName, createdBy, manufacture, type, page, limit } = req.query;

    const condition = {};

    // Filter by carName
    if (SeatName) condition.model = { [Op.iLike]: `%${SeatName}%` };

    // Filter by createdBy
    if (createdBy) condition.createdBy = createdBy;

    // Filter by manufacture
    if (manufacture) condition.manufacture = { [Op.iLike]: `${manufacture}%` };

    // Filter by type
    if (type) condition.type = { [Op.iLike]: `%${type}%` };

    const pageNum = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const offset = (pageNum - 1) * pageSize;

    const totalCount = await Seats.count({ where: condition });
    const seats = await Seats.findAll({
      where: condition,
      limit: pageSize,
      offset: offset,
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    res.status(200).json({
      status: "Success",
      message: "Seats succesfully retrieved",
      requestAt: req.requestTime,
      data: {
        seats,
        pagination: {
          totalData: totalCount,
          totalPages,
          pageNum,
          pageSize,
        },
      },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const createBulkSeats = async (req, res, next) => {
  try {
    const seats = req.body.seats;

    if (!seats) {
      return next(new ApiError("Seats is required", 400));
    }

    console.log(seats);

    const newSeats = await Seats.bulkCreate(seats);

    if (!newSeats) {
      return next(new ApiError("Unexpected Error!, seats not created", 400));
    }

    res.status(201).json({
      status: "Success",
      message: "Seats is successfully created",
      requestAt: req.requestTime,
      data: { newSeats },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const findBookedSeatsByFlightId = async (req, res, next) => {
  try {
    const flightId = req.params.flightId;

    if (!flightId || flightId === null) {
      return next(new ApiError("Flight ID is required", 400));
    }

    if (!isInt(flightId)) {
      return next(new ApiError("Flight ID is should be integer", 400));
    }

    const seats = await Seats.findAll({
      where: {
        flight_id: flightId,
        seat_status: {
          [Op.or]: ["locked", "unavailable"],
        },
      },
    });

    if (!seats) {
      return next(new ApiError(`Flight with id '${flightId}' not found`, 400));
    }

    res.status(200).json({
      status: "Success",
      message: "Seats is successfully retrieved",
      requestAt: req.requestTime,
      data: { seats },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const findSeatById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const seat = await Seats.findOne({
      where: {
        id,
      },
    });

    if (!seat) {
      return next(new ApiError(`Seat with id '${id}' is not found`, 404));
    }

    res.status(200).json({
      status: "Success",
      message: "Seat succesfully retrieved",
      requestAt: req.requestTime,
      data: {
        seat,
      },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const updateSeat = async (req, res, next) => {
  const { seat_row, seat_column, seat_name, flight_id, seat_status } = req.body;
  try {
    const id = req.params.id;
    const seat = await Seats.findOne({
      where: {
        id,
      },
    });
    if (!seat) {
      return next(new ApiError(`Seat with id '${id}' is not found`, 404));
    }
    await Seats.update(
      {
        seat_row,
        seat_column,
        seat_name,
        flight_id,
        seat_status,
      },
      {
        where: {
          id,
        },
      }
    );
    const updatedSeat = await Seats.findOne({
      where: {
        id,
      },
    });

    res.status(200).json({
      status: "Success",
      message: "Seat succesfully Update",
      requestAt: req.requestTime,
      data: {
        updatedSeat,
      },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const deleteSeat = async (req, res, next) => {
  try {
    const id = req.params.id;

    if (!isInt(id)) {
      return next(new ApiError("Seat ID Should be integer", 400));
    }

    const seat = await Seats.findOne({
      where: {
        id,
      },
    });

    if (!seat) {
      return next(new ApiError(`Seat with id '${id}' is not found`, 404));
    }

    await seat.destroy({
      where: {
        id,
      },
    });

    res.status(200).json({
      status: "Success",
      message: `Seat with id '${seat.id}' is successfully deleted`,
      requestAt: req.requestTime,
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const createSeat = async (req, res, next) => {
  const { seat_row, seat_column, seat_name, flight_id, seat_status } = req.body;

  try {
    const newSeat = await Seats.create({
      seat_row,
      seat_column,
      seat_name,
      flight_id,
      seat_status,
    });

    res.status(200).json({
      status: "Success",
      message: "Seat successfully created",
      requestAt: req.requestTime,
      data: {
        newSeat,
      },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

module.exports = {
  findSeats,
  findSeatById,
  updateSeat,
  deleteSeat,
  createSeat,
  createBulkSeats,
  findBookedSeatsByFlightId,
};
