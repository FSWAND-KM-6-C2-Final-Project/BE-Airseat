const router = require("express").Router();
const upload = require("../utils/multerConfig");
const adminAirportController = require("../controllers/adminAirportsController");
const authenticateAdmin = require("../middlewares/authenticateAdmin");

router.route("/list").get(adminAirportController.listAirport);

router
  .route("/add")
  .get(authenticateAdmin, adminAirportController.createAirportPage)
  .post(
    authenticateAdmin,
    upload.single("airport_picture"),
    adminAirportController.insertAirports
  );

router
  .route("/delete/:id")
  .post(authenticateAdmin, adminAirportController.deleteAirport);

router
  .route("/edit/:id")
  .get(authenticateAdmin, adminAirportController.editAirportPage);
router
  .route("/update/:id")
  .post(
    authenticateAdmin,
    upload.single("airport_picture"),
    adminAirportController.updateAirport
  );

module.exports = router;
