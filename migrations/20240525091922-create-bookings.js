"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Bookings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      booking_code: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      payment_method: {
        type: Sequelize.ENUM([
          "snap",
          "card",
          "gopay",
          "va_bni",
          "va_bri",
          "va_bca",
          "va_cimb",
          "va_mandiri",
          "va_permata",
        ]),
        defaultValue: "snap",
        allowNull: true,
      },
      payment_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      payment_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      payment_token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      flight_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      return_flight_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      ordered_by_first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ordered_by_last_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ordered_by_phone_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ordered_by_email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      total_amount: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      booking_expired: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      booking_status: {
        type: Sequelize.ENUM(["issued", "cancelled", "unpaid"]),
        defaultValue: "unpaid",
        allowNull: false,
      },
      discount_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      user_id: {
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
    await queryInterface.dropTable("Bookings");
  },
};
