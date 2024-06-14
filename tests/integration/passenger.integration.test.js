const dotenv = require("dotenv");
dotenv.config();

const request = require("supertest");
const app = require("../../app");
const { Passengers } = require("../../models");

describe("[API GET ALL PASSENGER TESTS]", () => {
  test("Success - Get All Passenger Data", async () => {
    const response = await request(app).get("/api/v1/passenger");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe("Passangers succesfully retrived");
    expect(response.body.requestAt).not.toBeNull();
    expect(response.body.data).not.toBeNull();
  });
});

describe("[API CREATE PASSENGER TESTS]", () => {
  test("Success - Create Passenger", async () => {
    const passenger = {
      first_name: "Akbar Rahmat",
      last_name: "Mulyatama",
      title: "mr",
      dob: "2003-11-28T00:00:00+07:00",
      nationality: "Indonesia",
      identification_type: "paspor",
      identification_number: "A12387",
      identification_country: "Indonesia",
      identification_expired: "2026-11-22T00:00:00+07:00",
    };

    const response = await request(app)
      .post(`/api/v1/passenger`)
      .send(passenger);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe("Passengers successfully created");
    expect(response.body.data).not.toBeNull();
  });
});

describe("[API GET ALL PASSENGER BY ID TESTS]", () => {
  test("Success - Get Passenger Data By ID", async () => {
    const passenger = await Passengers.findOne();

    console.log(passenger);

    const response = await request(app).get(
      `/api/v1/passenger/${passenger.id}`
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe("Passengers succesfully retrieved");
    expect(response.body.requestAt).not.toBeNull();
    expect(response.body.data).not.toBeNull();
  });

  test("Failed - Not Found Passenger Data", async () => {
    const response = await request(app).get(`/api/v1/passenger/123`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe(`Passengers with id '123' is not found`);
    expect(response.body.requestAt).not.toBeNull();
  });
});

describe("[API UPDATE PASSENGER TESTS]", () => {
  test("Failed - Not Found Passenger", async () => {
    const response = await request(app).patch(`/api/v1/passenger/000`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe(`Passengers with id '000' is not found`);
    expect(response.body.requestAt).not.toBeNull();
  });

  test("Success - Update Passenger", async () => {
    const passenger = {
      first_name: "Akbar",
    };

    const passengerData = await Passengers.findOne();

    const response = await request(app)
      .patch(`/api/v1/passenger/${passengerData.id}`)
      .send(passenger);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe(`Passengers succesfully Update`);
    expect(response.body.data).not.toBeNull();
    expect(response.body.requestAt).not.toBeNull();
  });
});

describe("[API DELETE PASSENGER TESTS]", () => {
  test("Failed - Not Found Passenger", async () => {
    const response = await request(app).delete(`/api/v1/passenger/883`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe(`Passengers with id '883' is not found`);
    expect(response.body.requestAt).not.toBeNull();
  });

  test("Success - Delete Passenger", async () => {
    const passengerData = await Passengers.findOne();

    const response = await request(app).delete(
      `/api/v1/passenger/${passengerData.id}`
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe(
      `Passenger with id '${passengerData.id}' is successfully deleted`
    );
    expect(response.body.requestAt).not.toBeNull();
  });
});
