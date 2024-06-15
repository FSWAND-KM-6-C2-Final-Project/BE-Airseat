"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const flightData = [
      {
        id: 505,
        flight_number: "FJ-234",
        information: "Baggage free 20kg",
        departure_time: "2024-08-28 18:00:00+07",
        arrival_time: "2024-08-28 20:00:00+07",
        departure_airport_id: 1,
        departure_terminal: "Terminal 3 Ultimate",
        arrival_airport_id: 2,
        price_economy: 1000000,
        price_premium_economy: 1500000,
        price_business: 2000000,
        price_first_class: 4000000,
        airline_id: 307,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 506,
        flight_number: "QA-454",
        information: "Baggage free 20kg",
        departure_time: "2024-08-28 16:00:00+07",
        arrival_time: "2024-08-28 18:00:00+07",
        departure_airport_id: 1,
        departure_terminal: "Terminal 3 Ultimate",
        arrival_airport_id: 2,
        price_economy: 1000000,
        price_premium_economy: 1500000,
        price_business: 2000000,
        price_first_class: 4000000,
        airline_id: 315,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 507,
        flight_number: "FJ-434",
        information: "Baggage free 20kg",
        departure_time: "2024-08-29 18:00:00+07",
        arrival_time: "2024-08-29 20:00:00+07",
        departure_airport_id: 2,
        departure_terminal: "Terminal 1",
        arrival_airport_id: 1,
        price_economy: 1000000,
        price_premium_economy: 1500000,
        price_business: 2000000,
        price_first_class: 4000000,
        airline_id: 307,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 508,
        flight_number: "AM-214",
        information: "Baggage free 20kg",
        departure_time: "2024-08-29 13:00:00+07",
        arrival_time: "2024-08-29 15:00:00+07",
        departure_airport_id: 2,
        departure_terminal: "Terminal 1",
        arrival_airport_id: 1,
        price_economy: 1000000,
        price_premium_economy: 1500000,
        price_business: 2000000,
        price_first_class: 4000000,
        airline_id: 312,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    if (process.env.NODE_ENV === "test") {
      return await queryInterface.bulkInsert("Flights", flightData);
    }
  },

  async down(queryInterface, Sequelize) {
    if (process.env.NODE_ENV === "test") {
      return await queryInterface.bulkDelete("Flights", null, {});
    }
  },
};
