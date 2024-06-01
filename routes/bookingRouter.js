const router = require("express").Router();

const bookingController = require("../controllers/bookingController");
const authenticate = require("../middlewares/authenticate");

router.post("/", authenticate, bookingController.createBooking);

module.exports = router;
