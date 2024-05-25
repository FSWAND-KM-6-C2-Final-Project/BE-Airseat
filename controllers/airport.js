const { Airports } = require("../models");
const ApiError = require("../utils/ApiError");

const findAirport = async (req, res, next) => {
  try {
    const { AirportName, createdBy, manufacture, type, page, limit } = req.query;

    const condition = {};

    // Filter by carName
    if (AirportName) condition.model = { [Op.iLike]: `%${AirportName}%` };

    // Filter by createdBy
    if (createdBy) condition.createdBy = createdBy;

    // Filter by manufacture
    if (manufacture) condition.manufacture = { [Op.iLike]: `${manufacture}%` };

    // Filter by type
    if (type) condition.type = { [Op.iLike]: `%${type}%` };

    const pageNum = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const offset = (pageNum - 1) * pageSize;

    const totalCount = await Airports.count({ where: condition });
    const airports = await Airports.findAll({
      where: condition,
      limit: pageSize,
      offset: offset,
    });

    const totalPages = Math.ceil(totalCount / pageSize);
    
    res.status(200).json({
      status: "Success",
      message: "Airports succesfully retrieved",
      requestAt: req.requestTime,
      data: {
        airports,
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

const findAirportById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const airport = await Airports.findOne({
      where: {
        id
      },
    });

    if (!airport) {
      return next(new ApiError(`Airport with id '${id}' is not found`, 404));
    }

    res.status(200).json({
      status: "Success",
      message: "Airport succesfully retrieved",
      requestAt: req.requestTime,
      data: {
        airport,
      },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const updateAirport = async (req, res, next) => {
  const { airport_name, airport_city, airport_city_code, airport_picture, airport_continent } = req.body;
  try {
    const id = req.params.id;
    const airport = await Airports.findOne({
      where: {
        id,
      },
    });
    if (!airport) {
      return next(new ApiError(`Airport with id '${id}' is not found`, 404));
    }
    await Airports.update(
      {
        airport_name,
        airport_city,
        airport_city_code,
        airport_picture,
        airport_continent
      },
      {
        where: {
          id
        },
      }
    );
    const updatedAirport = await Airports.findOne({
      where: {
        id,
      },
    });

    res.status(200).json({
      status: "Success",
      message: "Airport succesfully Update",
      requestAt: req.requestTime,
      data:{
        updatedAirport
      }
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const deleteAirport = async (req, res, next) => {
  try {
    const id = req.params.id;
    const airport = await Airports.findOne({
      where: {
        id
      },
    });

    if (!airport) {
      next(new ApiError(`Airport with id '${id}' is not found`, 404));
    }
    await airport.destroy({
      where: {
        id
      },
    });

    res.status(200).json({
      status: "Success",
      message: `Airport with id '${airport.id}' is successfully deleted`,
      requestAt: req.requestTime,
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const createAirport = async (req, res, next) => {
  const { airport_name, airport_city, airport_city_code, airport_picture, airport_continent } = req.body;

  try {
    const newAirport = await Airports.create({
      airport_name,
      airport_city,
      airport_city_code,
      airport_picture,
      airport_continent
    });

    res.status(200).json({
      status: "Success",
      message: "Airport successfully created",
      requestAt: req.requestTime,
      data: {
        newAirport,
      },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

module.exports = {
  findAirport,
  findAirportById,
  updateAirport,
  deleteAirport,
  createAirport,
};