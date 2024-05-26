const router = require("express").Router();

const authController = require("../controllers/authController");
const googleAuthController = require("../controllers/googleAuthController");

// router.post("/register", authController.register);

router.get("/google/token", googleAuthController.getGoogleURL);
router.get("/google/callback", googleAuthController.registerOrLoginViaGoogle);

module.exports = router;
