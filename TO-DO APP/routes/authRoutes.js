const express = require("express");
const routes = express.Router();
const path = require("path");
const fs = require("fs");

// /register, get/post
//get /register->signup.html
routes.get("/register", (req, res) => {
    res.redirect("/signup.html")
    //res.sendFile(path.join(__dirname,"./public/")
})

routes.post("/register", (req, res) => {
    let obj = {
        username: req.body.username,
        password: req.body.password
    }
    let users = [];
    fs.readFile("./users.json", "utf-8", (err, data) => {
        if (err)
            users = [];
        else
            users = JSON.parse(data);

        const results = users.filter((item) => {
            if (item.username == req.body.username)
                return true;
        });

        if (results.length != 0)
            res.send("User already exists");
        else {
            users.push(obj);
            fs.writeFile("./users.json", JSON.stringify(users), () => {
                res.redirect("/auth/login");
            })
        }
    });
})

routes.get("/login", (req, res) => {
    res.redirect("/login.html")
})

routes.post("/login", (req, res) => {
    let users = [];
    fs.readFile("./users.json", "utf-8", (err, data) => {
        if (err)
            users = [];
        else
            users = JSON.parse(data);

        const results = users.filter((item) => {
            if (item.username == req.body.username && item.password == req.body.password)
                return true;
        });

        if (results.length != 0) {
            req.session.user = req.body.username;
            res.redirect("/users/dashboard")
        }
        else {
            res.redirect("/auth/login");
        }
    });
})

module.exports = routes;