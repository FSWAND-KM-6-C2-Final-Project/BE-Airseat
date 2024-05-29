const { Airlines } = require("../models");
const ApiError = require("../utils/apiError");
const ImageKit = require("../utils/imageKit");

const uploadImage = async (file) => {
  try {
    const split = file.originalname.split(".");
    const extension = split[split.length - 1];

    // upload file ke imagekit
    const uploadedImage = await ImageKit.upload({
      file: file.buffer,
      fileName: `IMG-${Date.now()}.${extension}`,
      folder: "airline",
    });
    if (!uploadedImage) {
      return next(new ApiError("Could not upload image", 500));
    }
    return uploadedImage.url;
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const getAllAirlines = async (req, res, next) => {
  try {
    const allAirlines = await Airlines.findAll();

    res.status(200).json({
      status: "Success",
      message: "Airline successfully retrieved",
      requestAt: req.requestTime,
      data: { allAirlines },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const getAirlineById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const airline = await Airlines.findByPk(id);
    if (!airline) {
      throw new Error("Airline not found");
    }
    res.status(200).json({
      status: "Success",
      message: `Airline with id ${id} successfully retrieved`,
      reqestAt: req.requestTime,
      data: { airline },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const createAirline = async (req, res, next) => {
  try {
    const { airline_name } = req.body;
    const file = req.file;

    if (!airline_name || airline_name === null || airline_name === "") {
      return next(new ApiError("Airline name should be required!"));
    }

    if (!file) {
      return next(new ApiError("No file uploaded", 400));
    }

    let image;
    if (file) {
      image = await uploadImage(file);
    }

    const data = {
      airline_name,
      airline_picture: image,
    };

    const newAirline = await Airlines.create(data);

    res.status(201).json({
      status: "Success",
      message: "Airline successfully created",
      data: { newAirline },
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: error.message,
    });
  }
};

const updateAirline = async (req, res, next) => {
  try {
    const id = req.params.id;
    const airline = await Airlines.findByPk(id);
    const { airline_name } = req.body;

    if (!airline) {
      return next(new ApiError("Airline not found", 404));
    }

    const file = req.file || "";

    if (!airline_name || airline_name === null || airline_name === "") {
      return next(new ApiError("Airline name should be required!", 400));
    }

    if (file !== "") {
      let image = await uploadImage(file);

      await Airlines.update(
        {
          airline_name,
          airline_picture: image,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
    } else {
      await Airlines.update(
        {
          airline_name,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
    }

    const updatedData = await Airlines.findOne({
      where: {
        id,
      },
    });

    res.status(200).json({
      status: "Success",
      message: "Airline Successfully Updated",
      requesatAt: req.requestTime,
      data: { updatedData },
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: error.message,
    });
  }
};

const deleteAirline = async (req, res, next) => {
  try {
    const airline = await Airlines.findByPk(req.params.id);

    if (!airline) {
      return next(new ApiError("Airline not found", 404));
    }

    await Airlines.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({
      status: "Success",
      message: "Airline with is successfully deleted",
      requestAt: req.requestTime,
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};
module.exports = {
  getAllAirlines,
  getAirlineById,
  createAirline,
  updateAirline,
  deleteAirline,
};
