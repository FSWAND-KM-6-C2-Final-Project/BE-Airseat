const dotenv = require("dotenv");
dotenv.config();

const request = require("supertest");
const app = require("../app");
const { Discounts } = require("../models");

describe("[API GET ALL DISCOUNT TESTS]", () => {
  test("Success - Get All Discount Data", async () => {
    const response = await request(app).get("/api/v1/discount");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe("Discount successfully retrieved");
    expect(response.body.requestAt).not.toBeNull();
    expect(response.body.data).not.toBeNull();
  });
});

describe("[API GET ALL DISCOUNT BY ID TESTS]", () => {
  test("Success - Get Discount Data By ID", async () => {
    const discount = await Discounts.findOne();

    const response = await request(app).get(`/api/v1/discount/${discount.id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe("Discount successfully retrieved");
    expect(response.body.requestAt).not.toBeNull();
    expect(response.body.data).not.toBeNull();
  });

  test("Failed - Not Found Discount Data", async () => {
    const response = await request(app).get(`/api/v1/discount/099123872`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe(
      `Discount with id '099123872 is not found`
    );
    expect(response.body.requestAt).not.toBeNull();
  });
});

describe("[API CREATE DISCOUNT TESTS]", () => {
  test("Success - Create Discount", async () => {
    const discount = {
      discount_amount: 40,
      minimum_order: 200000,
      discount_expired: "2024-11-25T00:00:00+07:00",
    };

    const response = await request(app).post(`/api/v1/discount`).send(discount);

    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe("Discount successfully created");
    expect(response.body.data).not.toBeNull();
  });
});

describe("[API UPDATE DISCOUNT TESTS]", () => {
  test("Failed - Not Found Discount", async () => {
    const response = await request(app).patch(`/api/v1/discount/883`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe(`Discount with id '883 is not found`);
  });

  test("Success - Update Discount", async () => {
    const discount = {
      discount_amount: 22,
    };

    const discountData = await Discounts.findOne();

    const response = await request(app)
      .patch(`/api/v1/discount/${discountData.id}`)
      .send(discount);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe(`Discount successfully updated`);
    expect(response.body.data).not.toBeNull();
  });
});

describe("[API DELETE DISCOUNT TESTS]", () => {
  test("Failed - Not Found Discount", async () => {
    const response = await request(app).delete(`/api/v1/discount/883`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe(`Discount with id '883 is not found`);
  });

  test("Success - Delete Discount", async () => {
    const discountData = await Discounts.findOne();

    const response = await request(app).delete(
      `/api/v1/discount/${discountData.id}`
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe(
      `Discount with id '${discountData.id}' is successfully deleted`
    );
  });
});
