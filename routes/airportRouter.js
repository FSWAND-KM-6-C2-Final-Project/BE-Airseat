const router = require("express").Router();

const airport = require("../controllers/airport")

// route untuk menambah data
router.post("/create", airport.createAirport);
// route untuk mengambil semua data
router.get("/get", airport.findAirport);
// route untuk mengambil data sesuai id
router.get("/get/:id", airport.findAirportById);
// route untuk mengedit data sesuai id
router.patch("/update/:id", airport.updateAirport);
// route untuk menghapus data sesuai dengan id
router.delete("/delete/:id", airport.deleteAirport);

module.exports = router;