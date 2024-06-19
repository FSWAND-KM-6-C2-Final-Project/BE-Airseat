const router = require("express").Router();

const adminAuthController = require("../controllers/adminAuthController");

const authenticateAdmin = require("../middlewares/authenticateAdmin");

router
  .route("/login")
  .get(authenticateAdmin.isLogout, adminAuthController.createLoginPage);

router.route("/login").post(adminAuthController.login);

router
  .route("/logout")
  .get(authenticateAdmin.isLogin, adminAuthController.logout);

module.exports = router;
