const router = require("express").Router();

const adminAirlineController = require("../controllers/adminAirlineController");

router.route("/list").get(adminAirlineController.listAirline);

module.exports = router;
