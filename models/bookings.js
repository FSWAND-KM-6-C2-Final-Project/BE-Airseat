"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Bookings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Bookings.belongsTo(models.Flights, {
        foreignKey: {
          name: "flight_id",
        },
        as: "flight",
      });
      Bookings.belongsTo(models.Flights, {
        foreignKey: {
          name: "return_flight_id",
        },
        as: "returnFlight",
      });
      Bookings.belongsTo(models.Discounts, {
        foreignKey: {
          name: "discount_id",
        },
        as: "discount",
      });
      Bookings.belongsTo(models.Users, {
        foreignKey: {
          name: "user_id",
        },
      });

      Bookings.hasMany(models.Booking_Details, {
        foreignKey: {
          name: "booking_id",
        },
        as: "bookingDetail",
      });
    }
  }
  Bookings.init(
    {
      booking_code: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      payment_method: {
        type: DataTypes.ENUM([
          "snap_midtrans",
          "card",
          "gopay",
          "va_bni",
          "va_bri",
          "va_bca",
          "va_cimb",
          "va_mandiri",
          "va_permata",
        ]),
        defaultValue: "snap_midtrans",
        allowNull: true,
      },
      payment_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      payment_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      payment_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      flight_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      return_flight_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      ordered_by_first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ordered_by_last_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ordered_by_phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ordered_by_email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      total_amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      booking_expired: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      booking_status: {
        type: DataTypes.ENUM(["issued", "cancelled", "unpaid"]),
        defaultValue: "unpaid",
        allowNull: false,
      },
      discount_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Bookings",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Bookings;
};
