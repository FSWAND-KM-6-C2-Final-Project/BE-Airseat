const { Airports } = require("../models");
const ApiError = require("../utils/apiError");
const ImageKit = require("../utils/imageKit");
const { Op } = require("sequelize");

const uploadImage = async (file) => {
  try {
    const split = file.originalname.split(".");
    const extension = split[split.length - 1];

    // upload file ke imagekit
    const uploadedImage = await ImageKit.upload({
      file: file.buffer,
      fileName: `IMG-${Date.now()}.${extension}`,
      folder: "airport",
    });
    if (!uploadedImage) {
      return next(new ApiError("Could not upload image", 500));
    }
    return uploadedImage.url;
  } catch (err) {
    return err.message;
  }
};

const findAirport = async (req, res, next) => {
  try {
    const { name, cityName, page, limit } = req.query;

    const condition = {};

    // Filter by airport Name
    if (name) condition.airport_name = { [Op.iLike]: `%${name}%` };

    if (cityName) condition.airport_city = { [Op.iLike]: `%${cityName}%` };

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
      pagination: {
        totalData: totalCount,
        totalPages,
        pageNum,
        pageSize,
      },
      data: {
        airports,
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
        id,
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
  try {
    const { airport_name, airport_city, airport_city_code, airport_continent } =
      req.body;

    const id = req.params.id;

    const airport = await Airports.findOne({
      where: {
        id,
      },
    });
    if (!airport) {
      return next(new ApiError(`Airport with id '${id}' is not found`, 404));
    }

    const file = req.file || "";

    if (file !== "") {
      let image = await uploadImage(file);

      await Airports.update(
        {
          airport_name,
          airport_city,
          airport_city_code,
          airport_picture: image,
          airport_continent,
        },
        {
          where: {
            id,
          },
        }
      );
    } else {
      await Airports.update(
        {
          airport_name,
          airport_city,
          airport_city_code,
          airport_continent,
        },
        {
          where: {
            id,
          },
        }
      );
    }

    const updatedAirport = await Airports.findOne({
      where: {
        id,
      },
    });

    res.status(200).json({
      status: "Success",
      message: "Airport succesfully Update",
      requestAt: req.requestTime,
      data: {
        updatedAirport,
      },
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
        id,
      },
    });

    if (!airport) {
      next(new ApiError(`Airport with id '${id}' is not found`, 404));
    }
    await airport.destroy({
      where: {
        id,
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
  const { airport_name, airport_city, airport_city_code, airport_continent } =
    req.body;

  try {
    const file = req.file;

    if (!file) {
      return next(new ApiError("No file uploaded", 400));
    }

    let image;
    if (file) {
      image = await uploadImage(file);
    }

    const newAirport = await Airports.create({
      airport_name,
      airport_city,
      airport_city_code,
      airport_picture: image,
      airport_continent,
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
