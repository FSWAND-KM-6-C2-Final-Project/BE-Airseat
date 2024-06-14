const dotenv = require("dotenv");
dotenv.config();

const request = require("supertest");
const app = require("../../app");
const { Flights } = require("../../models");

describe("[API GET ALL FLIGHT TESTS]", () => {
  test("Success - Get All Flight Data", async () => {
    const response = await request(app).get("/api/v1/flight");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe("Flights succesfully retrieved");
    expect(response.body.requestAt).not.toBeNull();
    expect(response.body.data).not.toBeNull();
  });

  test("Success - Get All Flight Data By Continent", async () => {
    const response = await request(app).get("/api/v1/flight?continent=asia");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe("Flights succesfully retrieved");
    expect(response.body.requestAt).not.toBeNull();
    expect(response.body.data).not.toBeNull();
  });

  test("Success - Get All Flight Data By Departure Time", async () => {
    const response = await request(app).get(
      "/api/v1/flight?sortBy=departureTime&order=desc"
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe("Flights succesfully retrieved");
    expect(response.body.requestAt).not.toBeNull();
    expect(response.body.data).not.toBeNull();
  });

  test("Success - Get All Flight Data By Price (Economy)", async () => {
    const response = await request(app).get(
      "/api/v1/flight?sortBy=price_economy&order=desc"
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe("Flights succesfully retrieved");
    expect(response.body.requestAt).not.toBeNull();
    expect(response.body.data).not.toBeNull();
  });

  test("Success - Get All Flight Data By Price (Premium Economy)", async () => {
    const response = await request(app).get(
      "/api/v1/flight?sortBy=price_premium_economy&order=desc"
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe("Flights succesfully retrieved");
    expect(response.body.requestAt).not.toBeNull();
    expect(response.body.data).not.toBeNull();
  });

  test("Success - Get All Flight Data By Price (Business)", async () => {
    const response = await request(app).get(
      "/api/v1/flight?sortBy=price_business&order=desc"
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe("Flights succesfully retrieved");
    expect(response.body.requestAt).not.toBeNull();
    expect(response.body.data).not.toBeNull();
  });

  test("Success - Get All Flight Data By Price (First Class)", async () => {
    const response = await request(app).get(
      "/api/v1/flight?sortBy=price_first_class&order=desc"
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe("Flights succesfully retrieved");
    expect(response.body.requestAt).not.toBeNull();
    expect(response.body.data).not.toBeNull();
  });

  test("Success - Get All Flight Data By Airport Departure & Arrival", async () => {
    const response = await request(app).get(
      "/api/v1/flight?deptAirport=1&arrAirport=2"
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe("Flights succesfully retrieved");
    expect(response.body.requestAt).not.toBeNull();
    expect(response.body.data).not.toBeNull();
  });

  test("Success - Get Flight Data By Spesific Departure Date", async () => {
    const response = await request(app).get(
      "/api/v1/flight?searchDate=21-08-2024"
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe("Flights succesfully retrieved");
    expect(response.body.requestAt).not.toBeNull();
    expect(response.body.data).not.toBeNull();
  });

  test("Success - Pagination Flight", async () => {
    const response = await request(app).get("/api/v1/flight?limit=1&page=2");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe("Flights succesfully retrieved");
    expect(response.body.requestAt).not.toBeNull();
    expect(response.body.data).not.toBeNull();
  });
});

describe("[API GET ALL FLIGHT BY ID TESTS]", () => {
  test("Success - Get Flight Data By ID", async () => {
    const flight = await Flights.findOne();

    const response = await request(app).get(`/api/v1/flight/${flight.id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe("Flight succesfully retrieved");
    expect(response.body.requestAt).not.toBeNull();
    expect(response.body.data).not.toBeNull();
  });

  test("Failed - Not Found Flight Data", async () => {
    const response = await request(app).get(`/api/v1/flight/000`);

    expect(response.statusCode).toBe(404);
    expect(response.body.status).toBe("Failed");
    expect(response.body.message).toBe(`Flight with id '000' is not found`);
    expect(response.body.requestAt).not.toBeNull();
  });
});

describe("[API CREATE FLIGHT TESTS]", () => {
  test("Success - Create Flight", async () => {
    const flight = {
      flight_number: "JT-120",
      information: "Baggage free 20kg",
      departure_time: "2024-08-21T18:00:00+07:00",
      arrival_time: "2024-08-21T20:00:00+07:00",
      departure_airport_id: 1,
      departure_terminal: "Terminal 3 Ultimate",
      arrival_airport_id: 2,
      price_economy: 1000000,
      price_premium_economy: 1500000,
      price_business: 3000000,
      price_first_class: 10000000,
      airline_id: 1,
    };

    const response = await request(app).post(`/api/v1/flight`).send(flight);

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("Success");
    expect(response.body.message).toBe("Flight successfully created");
    expect(response.body.data).not.toBeNull();
    expect(response.body.requestAt).not.toBeNull();

    const checkSeat = await request(app).get(
      `/api/v1/seat/flight/${response.body.data.newFlight.id}`
    );

    expect(checkSeat.statusCode).toBe(200);
    expect(checkSeat.body.status).toBe("Success");
    expect(checkSeat.body.message).toBe(
      `Seats data with flight Id '${response.body.data.newFlight.id}' is successfully retrieved`
    );
    expect(response.body.requestAt).not.toBeNull();
  });
});
