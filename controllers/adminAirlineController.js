const listAirline = async (req, res, next) => {
  try {
    res.render("airline/list", {
      title: "Airline",
    });
  } catch (err) {
    res.render("error", {
      message: err.message,
    });
  }
};

module.exports = {
  listAirline,
};
