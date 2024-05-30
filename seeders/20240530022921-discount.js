'use strict';

const { DECIMAL, DATE } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const discountsData = [];

    for (let i = 1; i <= 5; i++){
      discountsData.push({
        discount_amount:`${i}`,
        minimum_order: `${i}`,
        discount_expired: "2023-02-10",
        created_at: new Date(),
        updated_at: new Date(),
      })
    }
    return queryInterface.bulkInsert('discounts', discountsData);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('discounts', null,{});
  }
};
