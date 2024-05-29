"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Passengers", [
      {
        first_name: "John",
        last_name: "Doe",
        title: "mr",
        dob: "1990-01-01",
        nationality: "Indonesia",
        identification_type: "ktp",
        identification_number: "1234567890",
        identification_country: "Indonesia",
        identification_expired: "2030-01-01",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: "Jane",
        last_name: "Doe",
        title: "ms",
        dob: "1992-02-02",
        nationality: "Indonesia",
        identification_type: "paspor",
        identification_number: "0987654321",
        identification_country: "Indonesia",
        identification_expired: "2032-02-02",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Passengers", null, {});
  },
};
