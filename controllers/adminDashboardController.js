const { Bookings, Users } = require("../models");

const createDashboardPage = async (req, res, next) => {
  try {
    const revenue = await Bookings.sum("total_amount", {
      where: {
        booking_status: "issued",
      },
    });

    const userVerified = await Users.count({
      where: {
        user_status: "verified",
      },
    });

    const issuedTransaction = await Bookings.count({
      where: {
        booking_status: "issued",
      },
    });

    const transactionData = await Bookings.findAll({
      order: [["created_at", "DESC"]],
    });

    const transaction = await Bookings.count();

    res.render("dashboard/index", {
      title: "Dashboard",
      name: req.session.name,
      revenue: revenue || 0,
      userVerified: userVerified || 0,
      transaction: transaction || 0,
      issuedTransaction: issuedTransaction || 0,
      transactionData: transactionData,
    });
  } catch (err) {
    res.render("error", {
      title: "Error",
      message: err.message,
    });
  }
};

module.exports = {
  createDashboardPage,
};
