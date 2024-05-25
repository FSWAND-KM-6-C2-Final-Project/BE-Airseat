"use strict";
const { Model, CreatedAt } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Airlines extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Airlines.hasMany(models.Flights, {
        foreignKey: {
          name: "airline_id",
        },
      });
    }
  }
  Airlines.init(
    {
      airline_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      airline_picture: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "default.png",
      },
    },
    {
      sequelize,
      modelName: "Airlines",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Airlines;
};
