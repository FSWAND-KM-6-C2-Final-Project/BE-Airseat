const router = require("express").Router();

const upload = require("../utils/multerConfig");

const adminAirlineController = require("../controllers/adminAirlineController");

const authenticateAdmin = require("../middlewares/authenticateAdmin");

router
  .route("/list")
  .get(authenticateAdmin, adminAirlineController.listAirline);
router
  .route("/add")
  .get(authenticateAdmin, adminAirlineController.createAirlinePage)
  .post(
    authenticateAdmin,
    upload.single("airline_picture"),
    adminAirlineController.insertAirlines
  );

router
  .route("/delete/:id")
  .post(authenticateAdmin, adminAirlineController.deleteAirline);

router
  .route("/edit/:id")
  .get(authenticateAdmin, adminAirlineController.editAirlinePage);

router
  .route("/update/:id")
  .post(
    authenticateAdmin,
    upload.single("airline_picture"),
    adminAirlineController.updateAirline
  );

module.exports = router;
