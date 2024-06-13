"use strict";

const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const users = [null, 1];
      const type = ["Notification", "Perubahan Jadwal", "Status Pesanan"];

      const getRandomUsers = () => {
        return users[Math.floor(Math.random() * users.length)];
      };

      const getRandomType = () => {
        return type[Math.floor(Math.random() * type.length)];
      };

      const generateNotification = (num) => {
        const notifications = [];

        for (let i = 0; i < num; i++) {
          const notification_type = getRandomType();
          const notification_title = faker.lorem.sentence({ min: 2, max: 3 });
          const notification_description = faker.lorem.sentence();
          const user_id = getRandomUsers();
          const created_at = new Date();
          const updated_at = new Date();

          notifications.push({
            notification_type,
            notification_title,
            notification_description,
            user_id,
            created_at,
            updated_at,
          });
        }

        return notifications;
      };

      const notification = generateNotification(50);

      return await queryInterface.bulkInsert("Notifications", notification);
    } catch (err) {
      console.log(err.message);
    }
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.bulkDelete("Notifications", null, {});
  },
};
