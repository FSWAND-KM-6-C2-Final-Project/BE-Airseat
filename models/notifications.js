"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notifications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Notifications.belongsTo(models.Users, {
        foreignKey: {
          name: "user_id",
        },
      });
    }
  }
  Notifications.init(
    {
      notification_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      notification_title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      notification_description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Notifications",
      underscored: true,
    }
  );
  return Notifications;
};
