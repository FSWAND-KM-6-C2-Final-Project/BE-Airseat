"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      full_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      verification_user_token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      verification_user_resend_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      verification_user_expired_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      reset_password_token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      reset_password_resend_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      reset_password_expired_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      user_status: {
        type: Sequelize.ENUM(["verified", "unverified"]),
        allowNull: false,
        defaultValue: "unverified",
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
    await queryInterface.dropTable("Users");
  },
};
