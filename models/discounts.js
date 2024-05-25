"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Discounts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Discounts.hasMany(models.Bookings, {
        foreignKey: {
          name: "discount_id",
        },
      });
    }
  }
  Discounts.init(
    {
      discount_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      minimum_order: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      discount_expired: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Discounts",
      underscored: true,
    }
  );
  return Discounts;
};
