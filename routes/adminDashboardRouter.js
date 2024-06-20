const router = require("express").Router();

const adminDashboardController = require("../controllers/adminDashboardController");

const authenticateAdmin = require("../middlewares/authenticateAdmin");

router
  .route("/")
  .get(authenticateAdmin, adminDashboardController.createDashboardPage);

module.exports = router;
