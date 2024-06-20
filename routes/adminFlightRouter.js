const router = require("express").Router();

const adminFlightController = require("../controllers/adminFlightController");

const authenticateAdmin = require("../middlewares/authenticateAdmin");

router.route("/list").get(adminFlightController.listFlight);
router
  .route("/add")
  .get(authenticateAdmin, adminFlightController.createFlightPage)
  .post(authenticateAdmin, adminFlightController.insertFlight);

router
  .route("/delete/:id")
  .post(authenticateAdmin, adminFlightController.deleteFlight);

router
  .route("/edit/:id")
  .get(authenticateAdmin, adminFlightController.editFlightPage);

router
  .route("/update/:id")
  .post(authenticateAdmin, adminFlightController.updateFlight);

module.exports = router;
