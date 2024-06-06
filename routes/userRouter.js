const router = require("express").Router();

const userProfileController = require("../controllers/userProfileController");

const authenticate = require("../middlewares/authenticate");

router.patch("/", authenticate, userProfileController.updateProfile);
router.delete("/", authenticate, userProfileController.deleteProfile);

module.exports = router;
