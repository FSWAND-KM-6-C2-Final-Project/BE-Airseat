'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up (queryInterface, Sequelize) {
    const airlinesData = [];

    for(let i = 1; i <= 5; i++){
      airlinesData.push({
        airline_name:`Airline ${i}`,
        airline_picture:`{}`,
        created_at :new Date(),
        updated_at: new Date(),
      });
    }
    return queryInterface.bulkInsert('airlines', airlinesData);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('airlines', null,{});
  }
};
