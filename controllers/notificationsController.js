const { Notifications } = require("../models");
const { Op } = require("sequelize");
const ApiError = require("../utils/apiError");

const findNotifications = async (req, res, next) => {
  try {
    const {
      notification_type,
      notification_title,
      notification_description,
      user_id,
      page,
      limit,
    } = req.query;

    const condition = {};

    // Filter by notification_type
    if (notification_type)
      condition.notification_type = { [Op.iLike]: `%${notification_type}% ` };

    // Filter by notification_title
    if (notification_title)
      condition.notification_title = { [Op.iLike]: `%${notification_title}%` };

    // Filter by notification_description
    if (notification_description)
      condition.notification_description = {
        [Op.iLike]: `%${notification_description}%`,
      };

    // Filter by user_id
    if (user_id) condition.user_id = { [Op.iLike]: `%${user_id}%` };

    const pageNum = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const offset = (pageNum - 1) * pageSize;

    const totalCount = await Notifications.count({ where: condition });
    const notification = await Notifications.findAll({
      where: condition,
      limit: pageSize,
      offset: offset,
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    res.status(200).json({
      status: "Success",
      message: "Notification succesfully retrieved",
      requestAt: req.requestTime,
      data: {
        notification,
      },
      pagination: {
        totalData: totalCount,
        totalPages,
        pageNum,
        pageSize,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
    return;
  }
};

const findByIdNotifications = async (req, res, next) => {
  try {
    const user_id = req.params.id;

    const notification = await Notifications.findOne({
      where: {
        id: user_id,
      },
    });

    if (!notification) {
      return next(
        new ApiError(`Notifications with id '${user_id}' is not found`, 404)
      );
    }
    res.status(200).json({
      status: "Success",
      message: "Notifications succesfully retrieved",
      requestAt: req.requestTime,
      data: {
        notification,
      },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const createNotifications = async (req, res, next) => {
  const {
    notification_type,
    notification_title,
    notification_description,
    user_id,
  } = req.body;

  try {
    const newNotification = await Notifications.create({
      notification_type,
      notification_title,
      notification_description,
      user_id,
    });
    console.log("newNotification");
    res.status(200).json({
      status: "Success",
      message: "Notification successfully created",
      requestAt: req.requestTime,

      data: {
        newNotification,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
    return;
  }
};

const updateNotifications = async (req, res, next) => {
  const user_Id = req.params.id;
  const {
    notification_type,
    notification_title,
    notification_description,
    user_id,
  } = req.body;

  try {
    let userId = await Notifications.findByPk(user_Id);

    if (!userId) {
      next(new ApiError("Notification not found", 400));
      return;
    }

    userId = await userId.update({
      notification_type,
      notification_title,
      notification_description,
      user_id,
    });

    res.status(200).json({
      status: "Success",
      message: "Notification Successfully Updated",
      requestAt: req.requestTime,
      data: {
        updatedNotification: userId,
      },
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
    return;
  }
};

const deleteNotifications = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const user_id = await Notifications.findByPk(userId);

    if (!user_id) {
      next(new ApiError("Notification not found", 400));
      return;
    }

    await user_id.destroy();

    res.status(200).json({
      status: "Success",
      message: "Notification deleted successfully",
      requestAt: req.requestTime,
    });
  } catch (err) {
    next(new ApiError(err.message, 400));
    return;
  }
};

module.exports = {
  findNotifications,
  findByIdNotifications,
  updateNotifications,
  createNotifications,
  deleteNotifications,
};
