"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Airports", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      airport_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      airport_city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      airport_city_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      airport_picture: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "default.png",
      },
      airport_continent: {
        type: Sequelize.ENUM([
          "asia",
          "africa",
          "america",
          "europe",
          "australia",
        ]),
        defaultValue: "asia",
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
    await queryInterface.dropTable("Airports");
  },
};
