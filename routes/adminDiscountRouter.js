const router = require("express").Router();

const adminDiscountController = require("../controllers/adminDiscountController");

router.route("/list").get(adminDiscountController.listDiscount);
router
  .route("/add")
  .get(adminDiscountController.createDiscountPage)
  .post(adminDiscountController.insertDiscount);

router.route("/delete/:id").post(adminDiscountController.deleteDiscount);

router.route("/edit/:id").get(adminDiscountController.editDiscountPage);

router.route("/update/:id").post(adminDiscountController.updateDiscount);

module.exports = router;
