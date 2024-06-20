const router = require("express").Router();

const adminNotificationController = require("../controllers/adminNotificationController");

const authenticateAdmin = require("../middlewares/authenticateAdmin");

router
  .route("/list")
  .get(authenticateAdmin, adminNotificationController.listNotification);
router
  .route("/add")
  .get(authenticateAdmin, adminNotificationController.createNotificationPage)
  .post(authenticateAdmin, adminNotificationController.insertNotification);

router
  .route("/delete/:id")
  .post(authenticateAdmin, adminNotificationController.deleteNotification);

router
  .route("/edit/:id")
  .get(authenticateAdmin, adminNotificationController.editNotificationPage);

router
  .route("/update/:id")
  .post(authenticateAdmin, adminNotificationController.updateNotification);

module.exports = router;
