const router = require("express").Router();
const passengers = require("../controllers/passengersControllers");

//get all passengers
router.get("/get", passengers.findPassengers);

// Create a new passenger
router.post("/create", passengers.createPassengers);

//get passenger by ID
router.get("/get/:id", passengers.findByIdPassengers);

//get Update an existing passenger
router.patch("/update/:id", passengers.updatePassengers);

// Delete a passenger
router.delete("/delete/:id", passengers.deletePassengers);

module.exports = router;
