const { Discounts } = require("../models");

const listDiscount = async (req, res, next) => {
  try {
    const discounts = await Discounts.findAll({
      order: [["created_at", "DESC"]],
    });

    res.render("discount/list", {
      title: "Discount",
      discounts: discounts,
      message: req.flash("message", ""),
      alertType: req.flash("alertType", ""),
    });
  } catch (err) {
    res.render("error", {
      title: "Error",
      message: err.message,
    });
  }
};

const createDiscountPage = async (req, res, next) => {
  try {
    res.render("discount/create", {
      title: "Discount",
    });
  } catch (err) {
    res.render("error", {
      title: "Error",
      message: err.message,
    });
  }
};

const insertDiscount = async (req, res, next) => {
  try {
    const { discount_amount, minimum_order, discount_expired } = req.body;
    await Discounts.create({
      discount_amount,
      minimum_order,
      discount_expired,
    });
    req.flash("message", "Saved");
    req.flash("alertType", "success");
    res.redirect("/admin/discount/list");
  } catch (err) {
    res.render("error", {
      title: "Error",
      message: err.message,
    });
  }
};

const deleteDiscount = async (req, res, next) => {
  try {
    const id = await req.params.id;

    const discount = await Discounts.findOne({
      where: {
        id: id,
      },
    });

    if (!discount) {
      return new Error("Not found discount data");
    }

    await Discounts.destroy({
      where: {
        id,
      },
    });

    req.flash("message", "Deleted");
    req.flash("alertType", "dark");
    res.redirect("/admin/discount/list");
  } catch (err) {
    res.render("error", {
      title: "Error",
      message: err.message,
    });
  }
};

const editDiscountPage = async (req, res, next) => {
  try {
    const id = req.params.id;

    const discount = await Discounts.findOne({
      where: {
        id,
      },
    });

    if (!discount) {
      return new Error("Not found discount data");
    }

    res.render("discount/edit", {
      title: "Discount",
      discount: discount,
    });
  } catch (err) {
    res.render("error", {
      title: "Error",
      message: err.message,
    });
  }
};

const updateDiscount = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { discount_amount, minimum_order, discount_expired } = req.body;
    const discount = await Discounts.findOne({
      where: {
        id,
      },
    });

    if (!discount) {
      return new Error("Not found discount data");
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

    req.flash("message", "Updated");
    req.flash("alertType", "primary");
    res.redirect("/admin/discount/list");
  } catch (err) {
    res.render("error", {
      title: "Error",
      message: err.message,
    });
  }
};

module.exports = {
  listDiscount,
  createDiscountPage,
  insertDiscount,
  deleteDiscount,
  editDiscountPage,
  updateDiscount,
};
