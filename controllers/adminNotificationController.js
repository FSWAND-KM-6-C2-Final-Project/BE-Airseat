const { Notifications, Users } = require("../models");
const users = require("../models/users");

const listNotification = async (req, res, next) => {
  try {
    const notifications = await Notifications.findAll({
      include: [
        {
          model: Users,
          as: "User",
          attributes: ["full_name"],
        },
      ],
    });

    console.log(notifications[0]);

    res.render("notification/list", {
      title: "Notification",
      notifications: notifications,
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

const createNotificationPage = async (req, res, next) => {
  try {
    const userId = await Users.findAll({
      order: [["full_name", "ASC"]],
    });

    res.render("notification/create", {
      title: "Notification",
      users: userId,
    });
  } catch (err) {
    res.render("error", {
      title: "Error",
      message: err.message,
    });
  }
};

const insertNotification = async (req, res, next) => {
  try {
    const {
      notification_type,
      notification_title,
      notification_description,
      user_id,
    } = req.body;

    if (user_id === "-") {
      await Notifications.create({
        notification_type,
        notification_title,
        notification_description,
      });
    } else {
      await Notifications.create({
        notification_type,
        notification_title,
        notification_description,
        user_id,
      });
    }

    req.flash("message", "Saved");
    req.flash("alertType", "success");
    res.redirect("/admin/notification/list");
  } catch (err) {
    res.render("error", {
      title: "Error",
      message: err.message,
    });
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    const id = await req.params.id;

    const notificatin = await Notifications.findOne({
      where: {
        id: id,
      },
    });

    if (!notificatin) {
      return new Error("Not found notification data");
    }

    await Notifications.destroy({
      where: {
        id,
      },
    });

    req.flash("message", "Deleted");
    req.flash("alertType", "dark");
    res.redirect("/admin/notification/list");
  } catch (err) {
    res.render("error", {
      title: "Error",
      message: err.message,
    });
  }
};

const editNotificationPage = async (req, res, next) => {
  try {
    const id = req.params.id;

    const notification = await Notifications.findOne({
      where: {
        id,
      },
    });

    if (!notification) {
      return new Error("Not found notification data");
    }

    const userId = await Users.findAll({
      order: [["full_name", "ASC"]],
    });

    console.log(notification);

    res.render("notification/edit", {
      title: "Notification",
      notification,
      users: userId,
    });
  } catch (err) {
    res.render("error", {
      title: "Error",
      message: err.message,
    });
  }
};

const updateNotification = async (req, res, next) => {
  try {
    const id = req.params.id;

    const {
      notification_type,
      notification_title,
      notification_description,
      user_id,
    } = req.body;

    const notificatin = await Notifications.findOne({
      where: {
        id,
      },
    });

    if (!notificatin) {
      return new Error("Not found notification data");
    }

    await Notifications.update(
      {
        notification_type,
        notification_title,
        notification_description,
        user_id,
      },
      {
        where: {
          id,
        },
      }
    );

    req.flash("message", "Updated");
    req.flash("alertType", "primary");
    res.redirect("/admin/notification/list");
  } catch (err) {
    res.render("error", {
      title: "Error",
      message: err.message,
    });
  }
};

module.exports = {
  listNotification,
  createNotificationPage,
  insertNotification,
  deleteNotification,
  editNotificationPage,
  updateNotification,
};
