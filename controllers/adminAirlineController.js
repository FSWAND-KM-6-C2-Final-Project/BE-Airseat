const { Airlines } = require("../models");
const imagekit = require("../utils/imageKit");

const listAirline = async (req, res, next) => {
  try {
    const airlines = await Airlines.findAll();

    res.render("airline/list", {
      title: "Airline",
      airlines: airlines,
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

const createAirlinePage = async (req, res, next) => {
  try {
    res.render("airline/create", {
      title: "Airline",
    });
  } catch (err) {
    res.render("error", {
      title: "Error",
      message: err.message,
    });
  }
};

const insertAirlines = async (req, res, next) => {
  try {
    const file = await req.file;
    const { airline_name } = req.body;

    if (file !== "") {
      const split = file.originalname.split(".");
      const extension = split[split.length - 1];

      const img = await imagekit.upload({
        file: file.buffer,
        fileName: `IMG-${Date.now()}.${extension}`,
      });

      await Airlines.create({
        airline_name,
        airline_picture: img.url,
      });
    } else {
      await Airlines.create({
        airline_name,
      });
    }

    req.flash("message", "Saved");
    req.flash("alertType", "success");
    res.redirect("/admin/airline/list");
  } catch (err) {
    res.render("error", {
      title: "Error",
      message: err.message,
    });
  }
};

const deleteAirline = async (req, res, next) => {
  try {
    const id = await req.params.id;

    const airline = await Airlines.findOne({
      where: {
        id: id,
      },
    });

    if (!airline) {
      return new Error("Not found airline data");
    }

    await Airlines.destroy({
      where: {
        id,
      },
    });

    req.flash("message", "Deleted");
    req.flash("alertType", "dark");
    res.redirect("/admin/airline/list");
  } catch (err) {
    res.render("error", {
      title: "Error",
      message: err.message,
    });
  }
};

const editAirlinePage = async (req, res, next) => {
  try {
    const id = req.params.id;

    const airline = await Airlines.findOne({
      where: {
        id,
      },
    });

    if (!airline) {
      return new Error("Not found airline data");
    }

    res.render("airline/edit", {
      title: "Airline",
      airline,
    });
  } catch (err) {
    res.render("error", {
      title: "Error",
      message: err.message,
    });
  }
};

const updateAirline = async (req, res, next) => {
  try {
    const id = req.params.id;

    const { airline_name } = req.body;

    const airline = await Airlines.findOne({
      where: {
        id,
      },
    });

    if (!airline) {
      return new Error("Not found airline data");
    }

    const file = req.file || "";

    let updateAirline;

    if (file !== "") {
      const split = file.originalname.split(".");
      const extension = split[split.length - 1];

      const img = await imagekit.upload({
        file: file.buffer,
        fileName: `IMG-${Date.now()}.${extension}`,
      });

      updateAirline = await Airlines.update(
        {
          airline_name: airline_name,
          airline_picture: img.url,
        },
        {
          where: {
            id,
          },
        }
      );
    } else {
      updateAirline = await Airlines.update(
        {
          airline_name: airline_name,
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
    res.redirect("/admin/airline/list");
  } catch (err) {
    res.render("error", {
      title: "Error",
      message: err.message,
    });
  }
};

module.exports = {
  listAirline,
  createAirlinePage,
  insertAirlines,
  deleteAirline,
  editAirlinePage,
  updateAirline,
};
