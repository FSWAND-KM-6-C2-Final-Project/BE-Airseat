const router = require("express").Router();

const adminAuthController = require("../controllers/adminAuthController");

const authenticateAdmin = require("../middlewares/authenticateAdmin");
const asyncFlash = require("../middlewares/asyncFlash");

router.use((req, res, next) => {
  res.locals.message = req.flash("message");
  res.locals.alertType = req.flash("alertType");
  next();
});

router.route("/login").get(adminAuthController.createLoginPage);

router.route("/login").post(adminAuthController.login);

router.route("/logout").get(adminAuthController.logout);

router.get("/get-session", async (req, res, next) => {
  try {
    console.log(req.session);
    const sessionIsLogin = req.session.isLogin || "No Session";
    res.send(`Session: ${sessionIsLogin}`);
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
