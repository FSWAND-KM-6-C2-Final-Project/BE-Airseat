const bcrypt = require("bcrypt");
const { Admins } = require("../models");
const createLoginPage = async (req, res, next) => {
  try {
    res.render("auth/login", {
      title: "Login",
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

const logout = async (req, res, next) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        res.render("error", {
          title: "Error",
          message: err.message,
        });
      }
      res.redirect("/admin/auth/login");
    });
  } catch (err) {
    res.render("error", {
      title: "Error",
      message: err.message,
    });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await Admins.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      req.flash("message", "Invalid Credentials");
      req.flash("alertType", "danger");
      res.redirect("/admin/auth/login");
    }

    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.loggedin = true;
      req.session.userid = user.id;
      req.session.email = user.email;
      req.session.name = user.name;
      res.redirect("/admin");
    } else {
      req.flash("message", "Invalid Credentials");
      req.flash("alertType", "danger");
      res.redirect("/admin/auth/login");
    }
  } catch (err) {
    res.render("error", {
      title: "Error",
      message: err.message,
    });
  }
};

module.exports = {
  createLoginPage,
  login,
  logout,
};
