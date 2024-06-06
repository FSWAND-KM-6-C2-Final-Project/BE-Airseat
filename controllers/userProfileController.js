const ApiError = require("../utils/apiError");
const { Users } = require("../models");

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { full_name, phone_number, email } = req.body;

    // Phone number and Email is future development, need discuss with FE & Android

    const user = await Users.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return next(new ApiError("Not Found User", 404));
    }

    const updateUser = await Users.update(
      {
        full_name,
      },
      {
        where: {
          id: userId,
        },
      }
    );

    if (!updateUser) {
      return next(new ApiError("Unexpected error, data not updated", 400));
    }

    res.status(200).json({
      status: "Success",
      message: "Profile successfully updated",
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const deleteProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await Users.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return next(new ApiError("Not Found User", 404));
    }

    const deleteUser = await Users.destroy({
      where: {
        id: userId,
      },
    });

    if (!deleteUser) {
      return next(new ApiError("Unexpected error, profile not deleted", 400));
    }

    res.status(200).json({
      status: "Success",
      message: "Profile successfully deleted",
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

module.exports = {
  updateProfile,
  deleteProfile,
};
