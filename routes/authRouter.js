const router = require("express").Router();

const authController = require("../controllers/authController");
const googleAuthController = require("../controllers/googleAuthController");

// router.post("/register", authController.register);

router.get("/google/token", googleAuthController.getToken);

module.exports = router;
