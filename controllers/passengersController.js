const { Passengers } = require("../models");
const ApiError = require("../utils/apiError");

const findPassengers = async (req, res, next) => {
  try {
    const passengers = await Passengers.findAll();
    res.status(200).json({
      status: "Success",
      message: "Passangers succesfully retrived",
      requestAt: req.requestTime,
      data: {
        passengers,
      },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const findByIdPassengers = async (req, res, next) => {
  try {
    const passenger_id = req.params.id;

    const passenger = await Passengers.findOne({
      where: {
        id: passenger_id,
      },
    });

    if (!passenger) {
      return next(
        new ApiError(`Passengers with id '${passenger_id}' is not found`, 404)
      );
    }
    res.status(200).json({
      status: "Success",
      message: "Passengers succesfully retrieved",
      requestAt: req.requestTime,
      data: {
        passenger,
      },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const createPassengers = async (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      title,
      dob,
      nationality,
      identification_type,
      identification_number,
      identification_country,
      identification_expired,
    } = req.body;

    const newPassenger = await Passengers.create({
      first_name,
      last_name,
      title,
      dob,
      nationality,
      identification_type,
      identification_number,
      identification_country,
      identification_expired,
    });

    res.status(200).json({
      status: "Success",
      message: "Passengers successfully created",
      requestAt: req.requestTime,
      data: { newPassenger },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const updatePassengers = async (req, res, next) => {
  const {
    first_name,
    last_name,
    title,
    dob,
    nationality,
    identification_type,
    identification_number,
    identification_country,
    identification_expired,
  } = req.body;

  try {
    const passenger_id = req.params.id;

    const isPassengerExist = await Passengers.findOne({
      where: {
        id: passenger_id,
      },
    });

    if (!isPassengerExist) {
      return next(
        new ApiError(`Passengers with id '${passenger_id}' is not found`, 404)
      );
    }

    const passenger = await Passengers.update(
      {
        first_name,
        last_name,
        title,
        dob,
        nationality,
        identification_type,
        identification_number,
        identification_country,
        identification_expired,
      },
      {
        where: {
          id: passenger_id,
        },
      }
    );

    if (!passenger) {
      return next(
        new ApiError("Unexpected error !, passenger not updated", 400)
      );
    }

    const updatedPassenger = await Passengers.findOne({
      where: {
        id: passenger_id,
      },
    });

    res.status(200).json({
      status: "Success",
      message: "Passengers succesfully Update",
      requestAt: req.requestTime,
      data: { passenger: updatedPassenger },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const deletePassengers = async (req, res, next) => {
  try {
    const passenger_id = req.params.id;

    const passenger = await Passengers.findOne({
      where: {
        id: passenger_id,
      },
    });

    if (!passenger) {
      return next(
        new ApiError(`Passengers with id '${passenger_id}' is not found`, 404)
      );
    }

    await passenger.destroy({
      where: {
        id: passenger_id,
      },
    });

    res.status(200).json({
      status: "Success",
      message: `Passenger with id '${passenger.id}' is successfully deleted`,
      requestAt: req.requestTime,
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

module.exports = {
  findPassengers,
  findByIdPassengers,
  createPassengers,
  updatePassengers,
  deletePassengers,
};
