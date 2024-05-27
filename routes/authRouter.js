const router = require("express").Router();

const authController = require("../controllers/authController");
const resetPasswordController = require("../controllers/resetPasswordController");
const googleAuthController = require("../controllers/googleAuthController");

const authenticate = require("../middlewares/authenticate");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authenticate, authController.checkUser);

router.post("/reset-password", resetPasswordController.createResetToken);
router.post(
  "/reset-password/verify",
  resetPasswordController.verifyResetTokenAndChangedPassword
);

router.get("/google/url", googleAuthController.getGoogleURL);
router.get("/google/callback", googleAuthController.registerOrLoginViaGoogle);

module.exports = router;
