const router = require("express").Router();

const authController = require("../controllers/authController");
const googleAuthController = require("../controllers/googleAuthController");

router.post("/register", authController.register);
router.post("/login", authController.login);

router.get("/google/url", googleAuthController.getGoogleURL);
router.get("/google/callback", googleAuthController.registerOrLoginViaGoogle);

module.exports = router;
