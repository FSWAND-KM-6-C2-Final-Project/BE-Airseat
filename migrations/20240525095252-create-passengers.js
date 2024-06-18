"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Passengers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      title: {
        type: Sequelize.ENUM(["mr", "ms", "miss", "mrs"]),
        defaultValue: "mr",
        allowNull: false,
      },
      dob: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      nationality: {
        type: Sequelize.STRING,
        defaultValue: "Indonesia",
        allowNull: false,
      },
      identification_type: {
        type: Sequelize.ENUM(["ktp", "paspor"]),
        defaultValue: "ktp",
        allowNull: false,
      },
      identification_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      identification_country: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      identification_expired: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      passenger_type: {
        type: Sequelize.STRING,
        defaultValue: "adult",
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
    await queryInterface.dropTable("Passengers");
  },
};
