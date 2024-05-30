const router = require ("express").Router();

const discountController = require ("../controllers/discountController");

router.get("/", discountController.getAllDiscount);
router.get("/:id", discountController.getDiscountById);
router.post("/", discountController.createDiscount);
router.patch("/:id", discountController.updateDiscount);
router.delete("/:id", discountController.deleteDiscount);

module.exports = router;