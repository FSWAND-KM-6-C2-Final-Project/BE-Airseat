const ApiError = require("../utils/apiError");
const crypto = require("crypto");

module.exports = async (req, res, next) => {
  try {
    const { status_code, signature_key, gross_amount, order_id } = req.body;

    // Check signature key
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const hash = crypto.createHash("sha512");
    hash.update(order_id + status_code + gross_amount + serverKey);
    const expectedSignatureKey = hash.digest("hex");

    if (signature_key !== expectedSignatureKey) {
      return next(new ApiError("Invalid signature key", 403));
    }

    next();
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};
