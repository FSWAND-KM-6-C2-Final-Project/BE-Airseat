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
      full_name: {
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
      verification_user_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      verification_user_resend_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      verification_user_expired_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      reset_password_token: {
        type: DataTypes.STRING,
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
      user_status: {
        type: DataTypes.ENUM(["verified", "unverified"]),
        allowNull: false,
        defaultValue: "unverified",
      },
    },
    {
      sequelize,
      modelName: "Users",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Users;
};
