"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Seats extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Seats.belongsTo(models.Flights, {
        foreignKey: {
          name: "flight_id",
        },
      });

      Seats.hasMany(models.Booking_Details, {
        foreignKey: {
          name: "seat_id",
        },
      });
    }
  }
  Seats.init(
    {
      seat_row: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      seat_column: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      seat_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      flight_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      seat_status: {
        type: DataTypes.ENUM(["available", "unavailable", "locked"]),
        defaultValue: "available",
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Seats",
      underscored: true,
    }
  );
  return Seats;
};
