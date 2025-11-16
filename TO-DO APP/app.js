const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");

app.use(cookieParser());
app.use(session({
    saveUninitialized: false,
    resave: true, // Changed to true to maintain session
    secret: 'asdsadsa23423@#$',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        httpOnly: true,
        secure: false // Set to false for HTTP (not HTTPS)
    }
}))

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//express-session
//cookie-parser
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const auth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        // Check if this is an API request (looking for JSON)
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            res.status(401).json({ error: 'Not authenticated' });
        } else {
            res.redirect("/auth/login");
        }
    }
}

// Root route - redirect to signup or dashboard based on session
app.get("/", (req, res) => {
    if (req.session.user) {
        res.redirect("/users/dashboard");
    } else {
        res.redirect("/auth/register");
    }
});

app.use("/auth", authRoutes);
app.use("/users", auth, userRoutes);

app.listen(3000, (err) => {
    if (err)
        console.log("Error in starting server...", err);
    else
        console.log("Server Started...")
})