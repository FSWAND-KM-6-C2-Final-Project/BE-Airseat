const dotenv = require("dotenv");
dotenv.config();

const request = require("supertest");
const app = require("../../app");
const { Airlines } = require("../../models");
const path = require("path");

describe("[API GET ALL AIRLINE TESTS]", () => {
  test("Success - Get All Airline Data", async () => {
    const response = await request(app).get("/api/v1/airline");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe("Airline successfully retrieved");
    expect(response.body.requestAt).not.toBeNull();
    expect(response.body.data).not.toBeNull();
  });
});

describe("[API GET AIRLINE BY ID TESTS]", () => {
  test("Success - Get Airline Data By ID", async () => {
    const airline = await Airlines.findOne();

    const response = await request(app).get(`/api/v1/airline/${airline.id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe(
      `Airline with id ${airline.id} successfully retrieved`
    );
    expect(response.body.requestAt).not.toBeNull();
    expect(response.body.data).not.toBeNull();
  });

  test("Failed - Not Found Airline Data", async () => {
    const response = await request(app).get(`/api/v1/airline/9992`);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe(`Airline not found`);
    expect(response.body.requestAt).not.toBeNull();
  });
});

describe("[API CREATE AIRLINE TESTS]", () => {
  test("Failed - Airline Name Is Required", async () => {
    const airline = {
      airline_name: null,
    };

    const response = await request(app).post(`/api/v1/airline`).send(airline);

    expect(response.statusCode).toBe(500);
    expect(response.body.status).toBe("Error");
    expect(response.body.message).toBe(`Airline name should be required!`);
  });

  test("Failed - Not Found File Upload", async () => {
    const airline = {
      airline_name: "Airseat Air",
    };

    const response = await request(app).post(`/api/v1/airline`).send(airline);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe("No file uploaded");
    expect(response.body.requestAt).not.toBeNull();
  });
  test("Failed - Airline name is required", async () => {
    const airline = {
      airline_name: null,
    };

    const response = await request(app).post(`/api/v1/airline`).send(airline);

    expect(response.statusCode).toBe(500);
    expect(response.body.status).toBe("Error");
    expect(response.body.message).toBe("Airline name should be required!");
    expect(response.body.requestAt).not.toBeNull();
  });
  test("Success - Create Airline", async () => {
    const airline = {
      airline_name: "Airseat Air",
    };

    const filePath = path.resolve(__dirname, "../../docs/img/db-diagram.png");

    const response = await request(app)
      .post(`/api/v1/airline`)
      .field(airline)
      .attach("airline_picture", filePath);

    expect(response.statusCode).toBe(201);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe("Airline successfully created");
    expect(response.body.data).not.toBeNull();
    expect(response.body.requestAt).not.toBeNull();
  });
});

describe("[API UPDATE AIRLINE TESTS]", () => {
  test("Failed - Not Found Airline", async () => {
    const response = await request(app).patch(`/api/v1/airline/883`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe(`Airline not found`);
    expect(response.body.requestAt).not.toBeNull();
  });

  test("Failed - Airline Name Is Required", async () => {
    const airline = {
      airline_name: null,
    };

    const airlineData = await Airlines.findOne();

    const response = await request(app)
      .patch(`/api/v1/airline/${airlineData.id}`)
      .send(airline);

    expect(response.statusCode).toBe(400);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe(`Airline name should be required!`);
  });

  test("Success - Update Airline", async () => {
    const airline = {
      airline_name: "Airseat Air",
    };

    const filePath = path.resolve(__dirname, "../../docs/img/db-diagram.png");

    const airlineData = await Airlines.findOne();

    const response = await request(app)
      .patch(`/api/v1/airline/${airlineData.id}`)
      .field(airline)
      .attach("airline_picture", filePath);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe(`Airline Successfully Updated`);
    expect(response.body.data).not.toBeNull();
  });

  test("Success - Update Airline With Upload", async () => {
    const airline = {
      airline_name: "Airseat Air",
    };

    const airlineData = await Airlines.findOne();

    const response = await request(app)
      .patch(`/api/v1/airline/${airlineData.id}`)
      .send(airline);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe(`Airline Successfully Updated`);
    expect(response.body.data).not.toBeNull();
  });
});

describe("[API DELETE AIRLINE TESTS]", () => {
  test("Failed - Not Found Airline", async () => {
    const response = await request(app).patch(`/api/v1/airline/883`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe(`Airline not found`);
    expect(response.body.requestAt).not.toBeNull();
  });

  test("Success - Delete Airline", async () => {
    const airlineData = await Airlines.findOne();

    console.log(airlineData);

    const response = await request(app).delete(
      `/api/v1/airline/${airlineData.id}`
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe(`Airline with is successfully deleted`);
  });
});
