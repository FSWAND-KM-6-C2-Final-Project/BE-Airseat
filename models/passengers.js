"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Passengers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Passengers.belongsToMany(models.Bookings, {
        through: models.Booking_Details,
        foreignKey: {
          name: "passenger_id",
        },
      });
    }
  }
  Passengers.init(
    {
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      title: {
        type: DataTypes.ENUM(["mr", "ms", "miss", "mrs"]),
        defaultValue: "mr",
        allowNull: false,
      },
      dob: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      nationality: {
        type: DataTypes.STRING,
        defaultValue: "Indonesia",
        allowNull: false,
      },
      identification_type: {
        type: DataTypes.ENUM(["ktp", "paspor"]),
        defaultValue: "ktp",
        allowNull: false,
      },
      identification_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      identification_country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      identification_expired: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Passengers",
      underscored: true,
    }
  );
  return Passengers;
};
