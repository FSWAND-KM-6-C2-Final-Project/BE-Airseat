const router = require("express").Router();
const upload = require("../utils/multerConfig");
const adminAirportController = require("../controllers/AdminAirportController");
const authenticateAdmin = require("../middlewares/authenticateAdmin");

router
  .route("/list")
  .get(authenticateAdmin.isLogin, adminAirportController.listAirport);

router
  .route("/add")
  .get(authenticateAdmin.isLogin, adminAirportController.createAirportPage)
  .post(
    authenticateAdmin.isLogin,
    upload.single("airport_picture"),
    adminAirportController.insertAirports
  );

router
  .route("/delete/:id")
  .post(
    authenticateAdmin.isLogin,
    adminAirportController.deleteAirport);

router
  .route("/edit/:id")
  .get(authenticateAdmin.isLogin,
    adminAirportController.editAirportPage
);
router
  .route("/update/:id")
  .post(
    authenticateAdmin.isLogin,
    upload.single("airport_picture"),
    adminAirportController.updateAirport
  );

module.exports = router;
