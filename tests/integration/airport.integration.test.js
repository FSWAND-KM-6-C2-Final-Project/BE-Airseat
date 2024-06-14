const dotenv = require("dotenv");
dotenv.config();

const request = require("supertest");
const app = require("../../app");
const { Airports } = require("../../models");
const path = require("path");

describe("[API GET ALL AIRPORT TESTS]", () => {
  test("Success - Get All Airport Data", async () => {
    const response = await request(app).get("/api/v1/airport");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe("Airports succesfully retrieved");
    expect(response.body.requestAt).not.toBeNull();
    expect(response.body.data).not.toBeNull();
  });
});

describe("[API GET AIRPORT BY ID TESTS]", () => {
  test("Success - Get Airport Data By ID", async () => {
    const airport = await Airports.findOne();

    const response = await request(app).get(`/api/v1/airport/${airport.id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe("Airport succesfully retrieved");
    expect(response.body.requestAt).not.toBeNull();
    expect(response.body.data).not.toBeNull();
  });

  test("Failed - Not Found Airport Data", async () => {
    const response = await request(app).get(`/api/v1/airport/9992`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe(`Airport with id '9992' is not found`);
    expect(response.body.requestAt).not.toBeNull();
  });
});

describe("[API CREATE AIRPORT TESTS]", () => {
  jest.setTimeout(30000);

  test("Failed - Not Found File Upload", async () => {
    const airline = {
      airline_name: "Airseat Air",
    };

    const response = await request(app).post(`/api/v1/airport`).send(airline);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe("No file uploaded");
    expect(response.body.requestAt).not.toBeNull();
  });

  test("Success - Create Airport", async () => {
    const airport = {
      airport_name: "Maluku Airport",
      airport_city: "Maluku",
      airport_city_code: "MLK",
      airport_continent: "asia",
    };

    const filePath = path.resolve(__dirname, "../../docs/img/db-diagram.png");

    const response = await request(app)
      .post(`/api/v1/airport`)
      .field(airport)
      .attach("airport_picture", filePath);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe("Airport successfully created");
    expect(response.body.data).not.toBeNull();
    expect(response.body.requestAt).not.toBeNull();
  });
});

describe("[API UPDATE AIRPORT TESTS]", () => {
  jest.setTimeout(30000);

  test("Failed - Not Found Airport", async () => {
    const response = await request(app).patch(`/api/v1/airport/883`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe(`Airport with id '883' is not found`);
    expect(response.body.requestAt).not.toBeNull();
  });

  test("Success - Update Airline With Upload", async () => {
    try {
      const airport = {
        airport_city_code: "MKL",
      };

      const filePath = path.resolve(__dirname, "../../docs/img/db-diagram.png");

      const airportData = await Airports.findOne();

      const response = await request(app)
        .patch(`/api/v1/airport/${airportData.id}`)
        .field(airport)
        .attach("airline_picture", filePath);

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("Success");
      expect(response.body.message).toBe(`Airport succesfully Update`);
      expect(response.body.data).not.toBeNull();
      expect(response.body.requestAt).not.toBeNull();
    } catch (err) {
      console.log(err.message);
    }
  });

  test("Success - Update Airport ", async () => {
    const airport = {
      airport_city_code: "MKL",
    };

    const airportData = await Airports.findOne();

    const response = await request(app)
      .patch(`/api/v1/airport/${airportData.id}`)
      .send(airport);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe(`Airport succesfully Update`);
    expect(response.body.data).not.toBeNull();
    expect(response.body.requestAt).not.toBeNull();
  });
});

describe("[API DELETE AIPORT TESTS]", () => {
  test("Failed - Not Found Aiport", async () => {
    const response = await request(app).delete(`/api/v1/airport/883`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe("Airport with id '883' is not found");
    expect(response.body.requestAt).not.toBeNull();
  });

  test("Success - Delete Airline", async () => {
    const airportData = await Airports.findOne();

    const response = await request(app).delete(
      `/api/v1/airport/${airportData.id}`
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe(
      `Airport with id '${airportData.id}' is successfully deleted`
    );
  });
});
