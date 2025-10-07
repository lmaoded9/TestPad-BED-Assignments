const express = require("express");
const routes = express.Router();
const fs = require("fs");

routes.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.redirect("/auth/login");
    });
})

routes.get("/dashboard", (req, res) => {
    res.redirect("/dashboard.html");
})

// Get todos for logged-in user
routes.get("/todos", (req, res) => {
    fs.readFile("./tasks.json", "utf-8", (err, data) => {
        let tasks = [];
        if (!err && data) {
            tasks = JSON.parse(data);
        }
        // Filter tasks for current user
        const userTasks = tasks.filter(task => task.username === req.session.user);
        res.json(userTasks);
    });
})

// Add new todo
routes.post("/todos", (req, res) => {
    const newTask = {
        id: Date.now().toString(), // Simple ID generation
        username: req.session.user,
        title: req.body.title,
        status: "pending"
    };
    
    fs.readFile("./tasks.json", "utf-8", (err, data) => {
        let tasks = [];
        if (!err && data) {
            tasks = JSON.parse(data);
        }
        tasks.push(newTask);
        
        fs.writeFile("./tasks.json", JSON.stringify(tasks), (err) => {
            if (err) {
                res.status(500).json({error: "Failed to save task"});
            } else {
                res.json(newTask);
            }
        });
    });
})

// Update todo status
routes.put("/todos/:id", (req, res) => {
    const taskId = req.params.id;
    
    fs.readFile("./tasks.json", "utf-8", (err, data) => {
        let tasks = [];
        if (!err && data) {
            tasks = JSON.parse(data);
        }
        
        const taskIndex = tasks.findIndex(task => task.id === taskId && task.username === req.session.user);
        if (taskIndex !== -1) {
            tasks[taskIndex].status = req.body.status;
            
            fs.writeFile("./tasks.json", JSON.stringify(tasks), (err) => {
                if (err) {
                    res.status(500).json({error: "Failed to update task"});
                } else {
                    res.json(tasks[taskIndex]);
                }
            });
        } else {
            res.status(404).json({error: "Task not found"});
        }
    });
})

// Delete todo
routes.delete("/todos/:id", (req, res) => {
    const taskId = req.params.id;
    
    fs.readFile("./tasks.json", "utf-8", (err, data) => {
        let tasks = [];
        if (!err && data) {
            tasks = JSON.parse(data);
        }
        
        const filteredTasks = tasks.filter(task => !(task.id === taskId && task.username === req.session.user));
        
        fs.writeFile("./tasks.json", JSON.stringify(filteredTasks), (err) => {
            if (err) {
                res.status(500).json({error: "Failed to delete task"});
            } else {
                res.json({message: "Task deleted"});
            }
        });
    });
})

module.exports = routes;
