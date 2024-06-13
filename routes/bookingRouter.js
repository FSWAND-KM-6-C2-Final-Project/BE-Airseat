const router = require("express").Router();

const bookingController = require("../controllers/bookingController");
const authenticate = require("../middlewares/authenticate");
const checkSignatureKey = require("../middlewares/checkSignatureKey");

router.post("/", authenticate, bookingController.createBooking);
router.post(
  "/update",
  checkSignatureKey,
  bookingController.updateBookingStatus
);
router.post(
  "/cancel/:bookingCode",
  authenticate,
  bookingController.cancelBooking
);
router.get(
  "/pay/status/:bookingCode",
  authenticate,
  bookingController.getPaymentStatus
);
router.get("/detail", authenticate, bookingController.getDetailBooking);

module.exports = router;
