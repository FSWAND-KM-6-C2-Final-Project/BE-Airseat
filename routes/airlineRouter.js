const router = require("express").Router();

const airlineController = require("../controllers/airlineController");
const upload = require("../utils/multerConfig");

router.post(
  "/",
  upload.single("airline_picture"),
  airlineController.createAirline
);
router.patch(
  "/:id",
  upload.single("airline_picture"),
  airlineController.updateAirline
);
router.get("/", airlineController.getAllAirlines);
router.get("/:id", airlineController.getAirlineById);
router.delete("/:id", airlineController.deleteAirline);

module.exports = router;
