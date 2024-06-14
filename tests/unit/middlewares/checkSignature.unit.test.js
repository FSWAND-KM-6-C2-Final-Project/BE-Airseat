const express = require("express");
const request = require("supertest");
const crypto = require("crypto");
const validateMidtransSignature = require("../../../middlewares/checkSignatureKey");
const ApiError = require("../../../utils/apiError");

const app = express();

app.use(express.json());

app.post("/midtrans-callback", validateMidtransSignature, (req, res) => {
  res.status(200).send({ message: "Signature is valid" });
});

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  res.status(500).send({ message: "Internal Server Error" });
});

describe("[MIDTRANS SIGNATURE KEY VALIDATION UNIT TESTS]", () => {
  const validBody = {
    status_code: "200",
    gross_amount: "10000",
    order_id: "order-123",
  };

  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const hash = crypto.createHash("sha512");
  hash.update(
    validBody.order_id +
      validBody.status_code +
      validBody.gross_amount +
      serverKey
  );
  const validSignatureKey = hash.digest("hex");

  it("should pass with a valid signature key", async () => {
    const response = await request(app)
      .post("/midtrans-callback")
      .send({ ...validBody, signature_key: validSignatureKey });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Signature is valid");
  });

  it("should fail with an invalid signature key", async () => {
    const response = await request(app)
      .post("/midtrans-callback")
      .send({ ...validBody, signature_key: "invalid_signature_key" });

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe("Invalid signature key");
  });

  it("should fail if any required field is missing", async () => {
    const response = await request(app)
      .post("/midtrans-callback")
      .send({ signature_key: validSignatureKey });

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toContain("Invalid signature key");
  });
});
