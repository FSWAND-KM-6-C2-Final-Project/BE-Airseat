const isLogin = (req, res, next) => {
  if (req.session.loggedin === true) {
    next();
    return;
  } else {
    req.session.destroy(function (err) {
      res.redirect("/admin/auth/login");
    });
  }
};

const isLogout = (req, res, next) => {
  if (req.session.loggedin !== true) {
    next();
    return;
  }
  res.redirect("/admin");
};

module.exports = {
  isLogin,
  isLogout,
};
