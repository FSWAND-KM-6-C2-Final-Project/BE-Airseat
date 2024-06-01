const router = require("express").Router();

const bookingController = require("../controllers/bookingController");
const authenticate = require("../middlewares/authenticate");

router.post("/", authenticate, bookingController.createBooking);
router.get(
  "/pay/status/:bookingCode",
  authenticate,
  bookingController.getPaymentStatus
);

module.exports = router;
