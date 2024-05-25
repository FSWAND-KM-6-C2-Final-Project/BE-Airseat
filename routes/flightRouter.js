const router = require("express").Router();

const flight = require("../controllers/FlightController")

// route untuk menambah data
router.post("/create", flight.createFlight);
// route untuk mengambil semua data
router.get("/get", flight.findFligths);
// route untuk mengambil data sesuai id
router.get("/get/:id", flight.findFlightById);
// route untuk mengedit data sesuai id
router.patch("/update/:id", flight.updateFlight);
// route untuk menghapus data sesuai dengan id
router.delete("/delete/:id", flight.deleteFlight);

module.exports = router;