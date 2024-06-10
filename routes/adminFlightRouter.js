const router = require("express").Router();

const adminFlightController = require("../controllers/adminFlightController");

router.route("/list").get(adminFlightController.listFlight);
router
  .route("/add")
  .get(adminFlightController.createFlightPage)
  .post(adminFlightController.insertFlight);

module.exports = router;
