"use strict";

const seatGenerator = require("../utils/seatGenerator");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const seats = seatGenerator(505);
      const seats2 = seatGenerator(506);
      const seats3 = seatGenerator(507);
      const seats4 = seatGenerator(508);
      const newSeats = seats.map((seat) => ({
        ...seat,
        created_at: new Date(),
        updated_at: new Date(),
      }));
      const newSeats2 = seats2.map((seat) => ({
        ...seat,
        created_at: new Date(),
        updated_at: new Date(),
      }));
      const newSeats3 = seats3.map((seat) => ({
        ...seat,
        created_at: new Date(),
        updated_at: new Date(),
      }));
      const newSeats4 = seats4.map((seat) => ({
        ...seat,
        created_at: new Date(),
        updated_at: new Date(),
      }));
      if (process.env.NODE_ENV === "test") {
        await queryInterface.bulkInsert("Seats", newSeats);
        await queryInterface.bulkInsert("Seats", newSeats2);
        await queryInterface.bulkInsert("Seats", newSeats3);
        return await queryInterface.bulkInsert("Seats", newSeats4);
      }
    } catch (err) {
      console.log(err.message);
    }
  },

  async down(queryInterface, Sequelize) {
    if (process.env.NODE_ENV === "test") {
      return await queryInterface.bulkDelete("Seats", null, {});
    }
  },
};
