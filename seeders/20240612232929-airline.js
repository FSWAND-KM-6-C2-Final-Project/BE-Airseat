"use strict";

const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const generateAirlines = (num) => {
        const airlines = [];

        for (let i = 0; i < num; i++) {
          const airline_name = faker.airline.airline().name;
          const airline_picture =
            "https://ik.imagekit.io/iaqozxfxq/airline/IMG-1717760002766_fHhdNlPAY.png?updatedAt=1717760005820";
          const created_at = new Date();
          const updated_at = new Date();

          airlines.push({
            airline_name,
            airline_picture,
            created_at,
            updated_at,
          });
        }

        return airlines;
      };

      const airlines = generateAirlines(50);

      return await queryInterface.bulkInsert("Airlines", airlines);
    } catch (err) {
      console.log(err.message);
    }
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.bulkDelete("Airlines", null, {});
  },
};
