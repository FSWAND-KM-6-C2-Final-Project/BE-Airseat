const router = require("express").Router();

const adminDiscountController = require("../controllers/adminDiscountController");

const authenticateAdmin = require("../middlewares/authenticateAdmin");

router
  .route("/list")
  .get(authenticateAdmin.isLogin, adminDiscountController.listDiscount);
router
  .route("/add")
  .get(authenticateAdmin.isLogin, adminDiscountController.createDiscountPage)
  .post(authenticateAdmin.isLogin, adminDiscountController.insertDiscount);

router
  .route("/delete/:id")
  .post(authenticateAdmin.isLogin, adminDiscountController.deleteDiscount);

router
  .route("/edit/:id")
  .get(authenticateAdmin.isLogin, adminDiscountController.editDiscountPage);

router
  .route("/update/:id")
  .post(authenticateAdmin.isLogin, adminDiscountController.updateDiscount);

module.exports = router;
