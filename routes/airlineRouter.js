const router = require("express").Router();

const Airline = require("../controllers/airlineController");

router.post("/", Airline.createAirline );
router.patch('/:id', Airline.updateAirline);
router.get("/", Airline.getAllAirlines);
router.get("/:id", Airline.getAirlineById);
router.delete("/:id", Airline.deleteAirline);


module.exports = router;