const router = require("express").Router();
const passengers = require("../controllers/passengersController");

//get all passengers
router.get("/", passengers.findPassengers);

// Create a new passenger
router.post("/", passengers.createPassengers);

//get passenger by ID
router.get("/:id", passengers.findByIdPassengers);

//get Update an existing passenger
router.patch("/:id", passengers.updatePassengers);

// Delete a passenger
router.delete("/:id", passengers.deletePassengers);

module.exports = router;
