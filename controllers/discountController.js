const { Discounts } = require("../models");
const ApiError = require("../utils/apiError");

const getAllDiscount = async (req, res, next) => {
  try {
    const discounts = await Discounts.findAll();

    res.status(200).json({
      status: "Success",
      message: "Discount successfully retrieved",
      requestAt: req.requestTime,
      data: { discounts },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const getDiscountById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const discount = await Discounts.findByPk(id);

    if (!discount) {
      return next(new ApiError(`Discount with id '${id} is not found`, 404));
    }
    res.status(200).json({
      status: "Success",
      message: "Discount successfully retrieved",
      requestAt: req.requestTime,
      data: { discount },
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

const createDiscount = async (req, res, next) => {
  try {
    const { discount_amount, minimum_order, discount_expired } = req.body;

    const data = {
      discount_amount,
      minimum_order,
      discount_expired,
    };

    const newDiscount = await Discounts.create(data);

    res.status(201).json({
      status: "Success",
      message: "Discount successfully created",
      data: { newDiscount },
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      message: error.message,
    });
  }
};

const updateDiscount = async (req, res, next) => {
  const { discount_amount, minimum_order, discount_expired } = req.body;

  try {
    const id = req.params.id;

    const discount = await Discounts.findOne({
      where: {
        id,
      },
    });

    if (!discount) {
      return next(new ApiError(`Discount with id '${id} is not found`, 404));
    }

    await Discounts.update(
      {
        discount_amount,
        minimum_order,
        discount_expired,
      },
      {
        where: {
          id,
        },
      }
    );

    const updateDiscount = await Discounts.findOne({
      where: {
        id,
      },
    });

    res.status(200).json({
      status: "Success",
      message: "Discount successfully updated",
      requesAt: req.requestTime,
      data: { updateDiscount },
    });
  } catch (error) {
    return next(new ApiError(error.message, 400));
  }
};

const deleteDiscount = async (req, res, next) => {
  try {
    const id = req.params.id;
    const discount = await Discounts.findOne({
      where: {
        id,
      },
    });

    if (!discount) {
      return next(new ApiError(`Discount with id '${id} is not found`, 404));
    }

    await discount.destroy({
      where: {
        id,
      },
    });
    res.status(200).json({
      status: "Success",
      message: `Discount with id '${discount.id}' is successfully deleted`,
      requestAt: req.requestTime,
    });
  } catch (err) {
    return next(new ApiError(err.message, 400));
  }
};

module.exports = {
  getAllDiscount,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscount,
};
