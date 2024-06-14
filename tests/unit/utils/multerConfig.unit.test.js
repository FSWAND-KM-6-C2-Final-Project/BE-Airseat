const request = require("supertest");
const express = require("express");
const upload = require("../../../utils/multerConfig");
const app = express();
const core = require("../../../app");
const path = require("path");
const ApiError = require("../../../utils/apiError");

app.post("/upload", upload.single("image"), (req, res, next) => {
  try {
    res.status(200).send({ message: "File uploaded successfully" });
  } catch (err) {
    console.log(err);
    return next(new ApiError(err.message, 400));
  }
});

describe("Multer Upload Middleware", () => {
  it("Success upload file", async () => {
    const filePath = path.resolve(
      __dirname,
      "../../../docs/img/db-diagram.png"
    );

    const response = await request(app)
      .post("/upload")
      .attach("image", filePath);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("File uploaded successfully");
  });

  it("Reject invalid type of uploaded file", async () => {
    const filePath = path.resolve(__dirname, "../../../README.md");

    const field = {
      airport_name: "Tes",
      airport_city: "Tes",
      airport_city_code: "Tes",
    };

    const response = await request(app)
      .post("/upload")
      .attach("image", filePath)
      .field(field);

    expect(response.statusCode).toBe(400);
  });
});
