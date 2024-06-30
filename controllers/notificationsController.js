const { Notifications } = require("../models");
const { Op } = require("sequelize");
const ApiError = require("../utils/apiError");

const findNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { page, limit, searchTitle, searchType } = req.query;

    const condition = {
      [Op.or]: [{ user_id: null }, { user_id: userId }],
    };

    if (searchTitle) {
      condition.notification_title = { [Op.iLike]: `%${searchTitle}%` };
    }

    if (searchType) {
      condition.notification_type = { [Op.iLike]: `%${searchType}%` };
    }

    const pageNum = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const offset = (pageNum - 1) * pageSize;

    const totalCount = await Notifications.count({ where: condition });
    const notification = await Notifications.findAll({
      order: [["created_at", "DESC"]],
      where: condition,
      limit: pageSize,
      offset: offset,
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    res.status(200).json({
      status: "Success",
      message: "Notification succesfully retrieved",
      requestAt: req.requestTime,
      pagination: {
        totalData: totalCount,
        totalPages,
        pageNum,
        pageSize,
      },
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

    res.status(200).json({
      status: "Success",
      message: "Notification successfully created",
      requestAt: req.requestTime,

      data: {
        newNotification,
      },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const updateNotifications = async (req, res, next) => {
  const notificationId = req.params.id;
  const {
    notification_type,
    notification_title,
    notification_description,
    user_id,
  } = req.body;

  try {
    let notification = await Notifications.findByPk(notificationId);

    if (!notification) {
      return next(new ApiError("Notification not found", 404));
    }

    notification = await notification.update({
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
        updatedNotification: notification,
      },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const deleteNotifications = async (req, res, next) => {
  const notificationId = req.params.id;

  try {
    const notification = await Notifications.findByPk(notificationId);

    if (!notification) {
      return next(new ApiError("Notification not found", 404));
    }

    await notification.destroy();

    res.status(200).json({
      status: "Success",
      message: "Notification deleted successfully",
      requestAt: req.requestTime,
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

module.exports = {
  findNotifications,
  updateNotifications,
  createNotifications,
  deleteNotifications,
};
