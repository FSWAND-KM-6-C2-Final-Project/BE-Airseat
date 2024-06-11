const router = require("express").Router();

const adminFlightController = require("../controllers/adminFlightController");

router.route("/list").get(adminFlightController.listFlight);
router
  .route("/add")
  .get(adminFlightController.createFlightPage)
  .post(adminFlightController.insertFlight);

router.route("/delete/:id").post(adminFlightController.deleteFlight);

router.route("/edit/:id").get(adminFlightController.editFlightPage);

router.route("/update/:id").post(adminFlightController.updateFlight);

module.exports = router;
