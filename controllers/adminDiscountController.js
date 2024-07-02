const { Discounts } = require("../models");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

const listDiscount = async (req, res, next) => {
  try {
    const discounts = await Discounts.findAll({
      order: [["created_at", "DESC"]],
    });

    res.render("discount/list", {
      title: "Discount",
      discounts: discounts,
      name: req.session.userName,
      message: req.flash("message", ""),
      alertType: req.flash("alertType", ""),
    });
  } catch (err) {
    res.render("error", {
      title: "Error",
      message: err.message,
      name: req.session.userName,
    });
  }
};

const createDiscountPage = async (req, res, next) => {
  try {
    res.render("discount/create", {
      title: "Discount",
      name: req.session.userName,
    });
  } catch (err) {
    res.render("error", {
      title: "Error",
      message: err.message,
      name: req.session.userName,
    });
  }
};

const insertDiscount = async (req, res, next) => {
  try {
    const { discount_amount, minimum_order, discount_expired } = req.body;

    const discountExpiredIso = dayjs(discount_expired)
      .tz("Asia/Jakarta")
      .toISOString();

    await Discounts.create({
      discount_amount,
      minimum_order,
      discount_expired: discountExpiredIso,
    });
    req.flash("message", "Saved");
    req.flash("alertType", "success");
    res.redirect("/admin/discount/list");
  } catch (err) {
    res.render("error", {
      title: "Error",
      message: err.message,
      name: req.session.userName,
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

    const formattedDiscountExpired = dayjs(discount.discount_expired)
      .tz("Asia/Jakarta")
      .format("YYYY-MM-DDTHH:mm");

    res.render("discount/edit", {
      title: "Discount",
      discount: {
        ...discount.dataValues,
        formattedDiscountExpired,
      },
      name: req.session.userName,
    });
  } catch (err) {
    res.render("error", {
      title: "Error",
      message: err.message,
      name: req.session.userName,
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
      name: req.session.userName,
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
