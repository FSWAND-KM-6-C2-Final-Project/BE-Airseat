"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Airports extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Airports.hasMany(models.Flights, {
        foreignKey: {
          name: "arrival_airport_id",
        },
        as: "arrivalAirport",
      });
      Airports.hasMany(models.Flights, {
        foreignKey: {
          name: "departure_airport_id",
        },
        as: "departureAirport",
      });
    }
  }
  Airports.init(
    {
      airport_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      airport_city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      airport_city_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      airport_picture: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "default.png",
      },
      airport_continent: {
        type: DataTypes.ENUM([
          "asia",
          "africa",
          "america",
          "europe",
          "australia",
        ]),
        defaultValue: "asia",
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Airports",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Airports;
};
