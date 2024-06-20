const bcrypt = require("bcrypt");
const { Admins } = require("../models");

const createLoginPage = async (req, res, next) => {
  try {
    res.render("auth/login", {
      title: "Login",
      message: res.locals.message[0] || "",
      alertType: res.locals.alertType[0] || "",
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
        return res.render("error", {
          title: "Error",
          message: err.message,
        });
      }
      return res.redirect("/admin/auth/login");
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
      where: { email },
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      req.flash("message", "Invalid Credentials");
      req.flash("alertType", "danger");
      return req.session.save((err) => {
        if (err) return next(err);
        return res.redirect("/admin/auth/login");
      });
    }

    req.session.isLogin = true;
    req.session.userId = user.id;
    req.session.userName = user.name;

    req.session.save((err) => {
      if (err) return next(err);
      return res.redirect("/admin");
    });
  } catch (err) {
    return res.render("error", {
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
