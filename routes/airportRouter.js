const router = require("express").Router();

const airport = require("../controllers/airportController");
const upload = require("../utils/multerConfig");

// route untuk menambah data
router.post("/", upload.single("airport_picture"), airport.createAirport);
// route untuk mengambil semua data
router.get("/", airport.findAirport);
// route untuk mengambil data sesuai id
router.get("/:id", airport.findAirportById);
// route untuk mengedit data sesuai id
router.patch("/:id", upload.single("airport_picture"), airport.updateAirport);
// route untuk menghapus data sesuai dengan id
router.delete("/:id", airport.deleteAirport);

module.exports = router;
