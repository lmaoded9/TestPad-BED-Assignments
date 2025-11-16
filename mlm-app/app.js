const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const memberRoutes = require("./routes/memberRoutes");

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: "mlm-app-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  if (req.session.memberCode) {
    res.redirect("/dashboard.html");
  } else {
    res.redirect("/join.html");
  }
});

app.use("/auth", authRoutes);
app.use("/members", memberRoutes);

app.use((err, req, res, next) => {
  console.error("Unexpected error:", err);
  if (res.headersSent) {
    return next(err);
  }
  const message = err.message || "Internal server error";
  const status = err.status || 500;
  if (req.accepts("json")) {
    res.status(status).json({ error: message });
  } else {
    res.status(status).send(message);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`MLM app listening on port ${PORT}`);
});
