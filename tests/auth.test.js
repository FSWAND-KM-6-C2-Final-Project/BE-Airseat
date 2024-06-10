const dotenv = require("dotenv");
dotenv.config();
const { Users } = require("../models");

const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");

describe("[API REGISTER AUTH TESTS]", () => {
  jest.setTimeout(30000);

  beforeAll(async () => {
    await Users.destroy({ where: {} });
  });

  afterAll(async () => {
    await Users.destroy({ where: {} });
  });

  test("Success Register", async () => {
    const credential = {
      full_name: "Test User",
      email: "theslowedchill@gmail.com",
      phone_number: "085174057230",
      password: "Users123456",
      confirm_password: "Users123456",
    };

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(credential);

    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe(
      "User account successfully registered, please check your email to activate your account"
    );
    expect(response.body.requestAt).not.toBeNull();
    expect(response.body.data).not.toBeNull();
  });

  test("Failed Register - Full name is not provided", async () => {
    const credential = {
      full_name: null,
      email: "theslowedchill@gmail.com",
      phone_number: "085174057230",
      password: "Users123456",
      confirm_password: "Users123456",
    };

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(credential);

    expect(response.statusCode).toBe(400);
  });

  test("Failed Register - Email is not provided", async () => {
    const credential = {
      full_name: "Test User",
      email: null,
      phone_number: "085174057230",
      password: "Users123456",
      confirm_password: "Users123456",
    };

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(credential);

    expect(response.statusCode).toBe(400);
  });

  test("Failed Register - Phone Number is not provided", async () => {
    const credential = {
      full_name: "Test User",
      email: "theslowedchill@gmail.com",
      phone_number: null,
      password: "Users123456",
      confirm_password: "Users123456",
    };

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(credential);

    expect(response.statusCode).toBe(400);
  });

  test("Failed Register - Password and confirm password is not match", async () => {
    const credential = {
      full_name: "Test User",
      email: "theslowedchill@gmail.com",
      phone_number: "085174057230",
      password: "Users12345677",
      confirm_password: "Users123456",
    };

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(credential);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe(
      "Password & Confirm Password is should be match!"
    );
    expect(response.body.requestAt).not.toBeNull();
    expect(response.body.data).not.toBeNull();
  });

  test("Failed Register - Password is should be 8 character or more", async () => {
    const credential = {
      full_name: "Test User",
      email: "theslowedchill@gmail.com",
      phone_number: "085174057230",
      password: "123",
      confirm_password: "123",
    };

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(credential);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe(
      "Password is should be 8 or more character!"
    );
    expect(response.body.requestAt).not.toBeNull();
  });
});
