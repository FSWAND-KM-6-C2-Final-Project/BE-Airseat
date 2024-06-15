const router = require("express").Router();

const adminFlightController = require("../controllers/adminFlightController");

const authenticateAdmin = require("../middlewares/authenticateAdmin");

router
  .route("/list")
  .get(authenticateAdmin.isLogin, adminFlightController.listFlight);
router
  .route("/add")
  .get(authenticateAdmin.isLogin, adminFlightController.createFlightPage)
  .post(authenticateAdmin.isLogin, adminFlightController.insertFlight);

router
  .route("/delete/:id")
  .post(authenticateAdmin.isLogin, adminFlightController.deleteFlight);

router
  .route("/edit/:id")
  .get(authenticateAdmin.isLogin, adminFlightController.editFlightPage);

router
  .route("/update/:id")
  .post(authenticateAdmin.isLogin, adminFlightController.updateFlight);

module.exports = router;
