"use strict";

const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const generateDiscount = (num) => {
        const discounts = [];

        for (let i = 0; i < num; i++) {
          const discount_amount = faker.number.int({ min: 10, max: 30 });
          const minimum_order = faker.finance.amount({
            min: 500000,
            max: 5000000,
            dec: 0,
          });
          const discount_expired = faker.date.future();
          const created_at = new Date();
          const updated_at = new Date();

          discounts.push({
            discount_amount,
            minimum_order,
            discount_expired,
            created_at,
            updated_at,
          });
        }

        return discounts;
      };

      const discounts = generateDiscount(10);

      return await queryInterface.bulkInsert("Discounts", discounts);
    } catch (err) {
      console.log(err.message);
    }
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.bulkDelete("Discounts", null, {});
  },
};
