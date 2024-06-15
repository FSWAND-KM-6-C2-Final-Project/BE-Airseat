"use strict";

const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const continents = ["asia", "europe", "africa", "america", "australia"];

      const getRandomContinent = () => {
        return continents[Math.floor(Math.random() * continents.length)];
      };

      const generateAirports = (num) => {
        const airports = [];

        for (let i = 0; i < num; i++) {
          const airport_name = faker.airline.airport().name;
          const airport_city = faker.location.city();
          const airport_city_code = faker.location.countryCode("alpha-3");
          const airport_picture = faker.image.urlLoremFlickr({
            category: "City",
          });
          const airport_continent = getRandomContinent();
          const created_at = new Date();
          const updated_at = new Date();

          airports.push({
            airport_name,
            airport_city,
            airport_city_code,
            airport_continent,
            airport_picture,
            created_at,
            updated_at,
          });
        }

        return airports;
      };

      const airports = generateAirports(50);

      if (process.env.NODE_ENV === "test") {
        return await queryInterface.bulkInsert("Airports", airports);
      }
    } catch (err) {
      console.log(err.message);
    }
  },

  async down(queryInterface, Sequelize) {
    if (process.env.NODE_ENV === "test") {
      return await queryInterface.bulkDelete("Airports", null, {});
    }
  },
};
