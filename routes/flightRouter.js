const router = require("express").Router();

const flight = require("../controllers/flightController");

// route untuk menambah data
router.post("/", flight.createFlight);
// route untuk mengambil semua data
router.get("/", flight.findFligths);
// route untuk mengambil data sesuai id
router.get("/:id", flight.findFlightById);
// route untuk mengedit data sesuai id
router.patch("/:id", flight.updateFlight);
// route untuk menghapus data sesuai dengan id
router.delete("/:id", flight.deleteFlight);

module.exports = router;
