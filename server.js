const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const session = require('express-session');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "event_manager_db",
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    }
    console.log("Connected to MySQL Database!");
});

// Serve static HTML files
app.get("/", (req, res) => res.sendFile(__dirname + "/views/index.html"));
app.get("/add-event", (req, res) => res.sendFile(__dirname + "/views/add-event.html"));
app.get("/view-event", (req, res) => res.sendFile(__dirname + "/views/view-event.html"));
app.get("/edit-event", (req, res) => res.sendFile(__dirname + "/views/edit-event.html"));

// Get all events
app.get("/api/events", (req, res) => {
    db.query("SELECT * FROM events ORDER BY date ASC", (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Get a specific event
app.get("/api/events/:id", (req, res) => {
    const eventId = req.params.id;
    db.query("SELECT * FROM events WHERE id = ?", [eventId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "Event not found" });
        }
        res.json(result[0]);
    });
});

// Create a new event
app.post("/add-event", (req, res) => {
    const { title, description, date } = req.body;

    if (!title || !description || !date) {
        return res.status(400).json({ error: "All fields are required" });
    }

    db.query("INSERT INTO events (title, description, date) VALUES (?, ?, ?)", 
        [title, description, date], 
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: "Event added successfully!", id: result.insertId });
        }
    );
});

// Update an event
app.put("/api/events/:id", (req, res) => {
    const eventId = req.params.id;
    const { title, description, date } = req.body;

    if (!title || !description || !date) {
        return res.status(400).json({ error: "All fields are required" });
    }

    db.query("UPDATE events SET title = ?, description = ?, date = ? WHERE id = ?", 
        [title, description, date, eventId], 
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: "Event updated successfully!" });
        }
    );
});

// Delete an event
app.delete("/api/events/:id", (req, res) => {
    const eventId = req.params.id;

    db.query("DELETE FROM events WHERE id = ?", [eventId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Event deleted successfully!" });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});