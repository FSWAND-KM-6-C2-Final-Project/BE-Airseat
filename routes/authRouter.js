const router = require("express").Router();

const authController = require("../controllers/authController");
const resetPasswordController = require("../controllers/resetPasswordController");
const userActivationController = require("../controllers/userActivationController");

const authenticate = require("../middlewares/authenticate");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authenticate, authController.checkUser);

router.post("/activation/resend", userActivationController.resendActivation);
router.post("/activation/verify", userActivationController.verifyActivation);

router.post("/password-reset", resetPasswordController.createResetPassword);
router.post(
  "/password-reset/resend",
  resetPasswordController.resendResetPassword
);
router.post(
  "/password-reset/verify",
  resetPasswordController.verifyResetPassword
);

module.exports = router;
