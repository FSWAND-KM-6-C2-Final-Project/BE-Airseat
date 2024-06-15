"use strict";

const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const password = "Admin123456";

    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    const data = [
      {
        name: "Akbar Rahmat Mulyatama",
        email: "akbarrahmatmulyatama@gmail.com",
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Admin Airseat",
        email: "airseat.mailsystem@gmail.com",
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    return await queryInterface.bulkInsert("Admins", data);
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.bulkDelete("Admins", null, {});
  },
};
