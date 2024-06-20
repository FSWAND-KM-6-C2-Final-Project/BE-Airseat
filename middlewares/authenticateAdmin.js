module.exports = {
  isLogin(req, res, next) {
    console.log(req.session);
    if (req.session.loggedin === true) {
      return next();
    } else {
      req.session.destroy(function (err) {
        res.redirect("/admin/auth/login");
      });
    }
  },
  isLogout(req, res, next) {
    console.log(req.session);
    if (req.session.loggedin !== true) {
      return next();
    }
    res.redirect("/admin");
  },
};
