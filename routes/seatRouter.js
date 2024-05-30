const router = require("express").Router();

const seatsController = require("../controllers/seatsController");

// route untuk menambah data
router.post("/", seatsController.createSeat);
router.post("/bulk", seatsController.createBulkSeats);
// route untuk mengambil semua data
router.get("/", seatsController.findSeats);
// route untuk mengambil data sesuai id
router.get("/:id", seatsController.findSeatById);
router.get("/booked/:flightId", seatsController.findBookedSeatsByFlightId);
// route untuk mengedit data sesuai id
router.patch("/:id", seatsController.updateSeat);
// route untuk menghapus data sesuai dengan id
router.delete("/:id", seatsController.deleteSeat);

module.exports = router;
