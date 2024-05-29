const router = require("express").Router();

const seat = require("../controllers/seatsController");

// route untuk menambah data
router.post("/", seat.createSeat);
// route untuk mengambil semua data
router.get("/", seat.findSeats);
// route untuk mengambil data sesuai id
router.get("/:id", seat.findSeatById);
// route untuk mengedit data sesuai id
router.patch("/:id", seat.updateSeat);
// route untuk menghapus data sesuai dengan id
router.delete("/:id", seat.deleteSeat);

module.exports = router;
