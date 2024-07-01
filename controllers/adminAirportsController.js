const { Airports } = require("../models");
const imageKit = require("../utils/imageKit");

const listAirport = async (req, res, next) => {
  try {
    const airports = await Airports.findAll({
      order: [["created_at", "DESC"]],
    });
    res.render("airport/list", {
      title: "Airport",
      airports: airports,
      message: req.flash("message", ""),
      alertType: req.flash("alertType", ""),
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
const createAirportPage = async (req, res, next) => {
  try {
    res.render("airport/create", {
      title: "Airport",
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
const insertAirports = async (req, res, next) => {
  try {
    const file = await req.file;
    const { airport_name, airport_city, airport_city_code, airport_continent } =
      req.body;

    if (file !== "") {
      const split = file.originalname.split(".");
      const extension = split[split.length - 1];

      const img = await imageKit.upload({
        file: file.buffer,
        fileName: `IMG-${Date.now()}.${extension}`,
      });

      await Airports.create({
        airport_name,
        airport_city,
        airport_city_code,
        airport_picture: img.url,
        airport_continent,
      });
    } else {
      await Airports.create({
        airport_name,
        airport_city,
        airport_city_code,
        airport_continent,
      });
    }
    req.flash("message", "Saved");
    req.flash("alertType", "success");
    res.redirect("/admin/airport/list");
  } catch (error) {
    res.render("error", {
      title: "Error",
      message: error.message,
      name: req.session.userName,
    });
  }
};
const editAirportPage = async (req, res, next) => {
  try {
    const id = req.params.id;

    const airport = await Airports.findOne({
      where: {
        id,
      },
    });

    if (!airport) {
      return new Error("Not found airport data");
    }
    res.render("airport/edit", {
      title: "Airport",
      airport,
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
const deleteAirport = async (req, res, next) => {
  try {
    const id = await req.params.id;
    const airport = await Airports.findOne({
      where: {
        id,
      },
    });
    if (!airport) {
      return new Error("Not found Airport data");
    }
    await Airports.destroy({
      where: {
        id,
      },
    });

    req.flash("message", "Deleted");
    req.flash("alertType", "dark");
    res.redirect("/admin/airport/list");
  } catch (err) {
    res.render("error", {
      title: "Error",
      message: err.message,
      name: req.session.userName,
    });
  }
};
const updateAirport = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { airport_name, airport_city, airport_city_code, airport_continent } =
      req.body;

    const airport = await Airports.findOne({
      where: {
        id,
      },
    });

    if (!airport) {
      return new Error("No found Airport data");
    }
    const file = req.file || "";

    let updateAirport;

    if (file !== "") {
      const split = file.originalname.split(".");
      const extension = split[split.length - 1];

      const img = await imageKit.upload({
        file: file.buffer,
        fileName: `IMG-${Date.now()}.${extension}`,
      });

      updateAirport = await Airports.update(
        {
          airport_name,
          airport_city,
          airport_city_code,
          airport_continent,
          airport_picture: img.url,
        },
        {
          where: {
            id,
          },
        }
      );
    } else {
      updateAirport = await Airports.update(
        {
          airport_name: airport_name,
          airport_city,
          airport_city_code,
          airport_continent,
        },
        {
          where: {
            id,
          },
        }
      );
    }

    req.flash("message", "Updated");
    req.flash("alertType", "primary");
    res.redirect("/admin/airport/list");
  } catch (err) {
    res.render("error", {
      title: "Error",
      message: err.message,
      name: req.session.userName,
    });
  }
};

module.exports = {
  listAirport,
  updateAirport,
  insertAirports,
  deleteAirport,
  createAirportPage,
  editAirportPage,
};
