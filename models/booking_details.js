"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking_Details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking_Details.belongsTo(models.Seats, {
        foreignKey: {
          name: "seat_id",
        },
        as: "seat",
      });
      Booking_Details.belongsTo(models.Bookings, {
        foreignKey: {
          name: "booking_id",
        },
      });
      Booking_Details.belongsTo(models.Passengers, {
        foreignKey: {
          name: "passenger_id",
        },
      });
    }
  }
  Booking_Details.init(
    {
      seat_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      passenger_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Booking_Details",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Booking_Details;
};
