const router = require("express").Router();

const adminNotificationController = require("../controllers/adminNotificationController");

const authenticateAdmin = require("../middlewares/authenticateAdmin");

router
  .route("/list")
  .get(authenticateAdmin.isLogin, adminNotificationController.listNotification);
router
  .route("/add")
  .get(
    authenticateAdmin.isLogin,
    adminNotificationController.createNotificationPage
  )
  .post(
    authenticateAdmin.isLogin,
    adminNotificationController.insertNotification
  );

router
  .route("/delete/:id")
  .post(
    authenticateAdmin.isLogin,
    adminNotificationController.deleteNotification
  );

router
  .route("/edit/:id")
  .get(
    authenticateAdmin.isLogin,
    adminNotificationController.editNotificationPage
  );

router
  .route("/update/:id")
  .post(
    authenticateAdmin.isLogin,
    adminNotificationController.updateNotification
  );

module.exports = router;
