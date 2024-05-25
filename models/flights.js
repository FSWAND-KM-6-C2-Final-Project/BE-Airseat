"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Flights extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Flights.belongsTo(models.Airports, {
        foreignKey: {
          name: "departure_airport_id",
        },
        as: "departureAirport",
      });
      Flights.belongsTo(models.Airports, {
        foreignKey: {
          name: "arrival_airport_id",
        },
        as: "arrivalAirport",
      });
      Flights.belongsTo(models.Airline, {
        foreignKey: {
          name: "airline_id",
        },
      });

      Flights.hasMany(models.Bookings, {
        foreignKey: {
          name: "flight_id",
        },
      });
      Flights.hasMany(models.Seats, {
        foreignKey: {
          name: "flight_id",
        },
      });
    }
  }
  Flights.init(
    {
      flight_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      information: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      departure_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      arrival_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      departure_airport_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      departure_terminal: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      arrival_airport_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price_economy: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      price_premium_economy: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      price_business: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      price_first_class: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      seat: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      airline_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Flights",
      underscored: true,
    }
  );
  return Flights;
};
