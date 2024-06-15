const createDashboardPage = async (req, res, next) => {
  try {
    res.render("dashboard/index", {
      title: "Dashboard",
      name: req.session.name,
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
