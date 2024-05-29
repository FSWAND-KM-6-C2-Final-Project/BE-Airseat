"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Seats", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      seat_row: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      seat_column: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      seat_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      flight_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      seat_status: {
        type: Sequelize.ENUM(["available", "unavailable", "locked"]),
        defaultValue: "available",
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Seats");
  },
};
