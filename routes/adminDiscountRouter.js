const router = require("express").Router();

const adminDiscountController = require("../controllers/adminDiscountController");

const authenticateAdmin = require("../middlewares/authenticateAdmin");

router
  .route("/list")
  .get(authenticateAdmin, adminDiscountController.listDiscount);
router
  .route("/add")
  .get(authenticateAdmin, adminDiscountController.createDiscountPage)
  .post(authenticateAdmin, adminDiscountController.insertDiscount);

router
  .route("/delete/:id")
  .post(authenticateAdmin, adminDiscountController.deleteDiscount);

router
  .route("/edit/:id")
  .get(authenticateAdmin, adminDiscountController.editDiscountPage);

router
  .route("/update/:id")
  .post(authenticateAdmin, adminDiscountController.updateDiscount);

module.exports = router;
