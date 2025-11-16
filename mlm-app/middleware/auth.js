module.exports = function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.memberCode) {
    return next();
  }

  if (req.accepts("json")) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  res.redirect("/login.html");
};
