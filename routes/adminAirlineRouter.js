const router = require("express").Router();

const upload = require("../utils/multerConfig");

const adminAirlineController = require("../controllers/adminAirlineController");

const authenticateAdmin = require("../middlewares/authenticateAdmin");

router
  .route("/list")
  .get(authenticateAdmin.isLogin, adminAirlineController.listAirline);
router
  .route("/add")
  .get(authenticateAdmin.isLogin, adminAirlineController.createAirlinePage)
  .post(
    authenticateAdmin.isLogin,
    upload.single("airline_picture"),
    adminAirlineController.insertAirlines
  );

router
  .route("/delete/:id")
  .post(authenticateAdmin.isLogin, adminAirlineController.deleteAirline);

router
  .route("/edit/:id")
  .get(authenticateAdmin.isLogin, adminAirlineController.editAirlinePage);

router
  .route("/update/:id")
  .post(
    authenticateAdmin.isLogin,
    upload.single("airline_picture"),
    adminAirlineController.updateAirline
  );

module.exports = router;
