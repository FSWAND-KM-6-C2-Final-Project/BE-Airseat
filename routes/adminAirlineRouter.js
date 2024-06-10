const router = require("express").Router();

const upload = require("../utils/multerConfig");

const adminAirlineController = require("../controllers/adminAirlineController");

router.route("/list").get(adminAirlineController.listAirline);
router
  .route("/add")
  .get(adminAirlineController.createAirlinePage)
  .post(
    upload.single("airline_picture"),
    adminAirlineController.insertAirlines
  );

router.route("/delete/:id").post(adminAirlineController.deleteAirline);

router.route("/edit/:id").get(adminAirlineController.editAirlinePage);

router
  .route("/update/:id")
  .post(upload.single("airline_picture"), adminAirlineController.updateAirline);

module.exports = router;
