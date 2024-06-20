const authenticateAdmin = (req, res, next) => {
  try {
    const isLogin = req.session.isLogin;
    if (isLogin === true) {
      next();
    } else {
      return res.redirect("/admin/auth/login");
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = authenticateAdmin;
