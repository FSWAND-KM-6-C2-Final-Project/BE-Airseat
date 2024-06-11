const router = require("express").Router();

const adminNotificationController = require("../controllers/adminNotificationController");

router.route("/list").get(adminNotificationController.listNotification);
router
  .route("/add")
  .get(adminNotificationController.createNotificationPage)
  .post(adminNotificationController.insertNotification);

router.route("/delete/:id").post(adminNotificationController.deleteNotification);

router.route("/edit/:id").get(adminNotificationController.editNotificationPage);

router
  .route("/update/:id")
  .post(adminNotificationController.updateNotification);

module.exports = router;
