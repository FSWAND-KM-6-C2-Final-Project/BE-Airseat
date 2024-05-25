"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Users.hasMany(models.Bookings, {
        foreignKey: {
          name: "user_id",
        },
      });
      Users.hasMany(models.Notifications, {
        foreignKey: {
          name: "user_id",
        },
      });
    }
  }
  Users.init(
    {
      google_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      auth_type: {
        type: DataTypes.ENUM(["google", "general"]),
        defaultValue: "general",
        allowNull: false,
      },
      reset_password_token: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      reset_password_resend_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      reset_password_expired_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Users",
      underscored: true,
    }
  );
  return Users;
};
