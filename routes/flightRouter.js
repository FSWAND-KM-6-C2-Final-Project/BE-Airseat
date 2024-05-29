const router = require("express").Router();

const flightController = require("../controllers/flightController");

// route untuk menambah data
router.post("/", flightController.createFlight);
// route untuk mengambil semua data
router.get("/", flightController.findFligths);
// route untuk mengambil data sesuai id
router.get("/:id", flightController.findFlightById);
// route untuk mengedit data sesuai id
router.patch("/:id", flightController.updateFlight);
// route untuk menghapus data sesuai dengan id
router.delete("/:id", flightController.deleteFlight);

module.exports = router;
