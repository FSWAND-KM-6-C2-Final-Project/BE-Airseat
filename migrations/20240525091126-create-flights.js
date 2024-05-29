"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Flights", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      flight_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      information: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      departure_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      arrival_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      departure_airport_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      departure_terminal: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      arrival_airport_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      price_economy: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      price_premium_economy: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      price_business: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      price_first_class: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      seat: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      airline_id: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("Flights");
  },
};
