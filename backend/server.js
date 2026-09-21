const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
const PORT = 5050;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const db = mysql.createPool({
    host: "mysql-db",
    user: "admin",
    password: "qwerty",
    database: "appdb",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
app.get("/", (req, res) => {
    res.send("Node.js Backend is running");
});

// GET all users
app.get("/getUsers", async (req, res) => {

    try {
        const [rows] = await db.query("SELECT * FROM users");

        res.json(rows);

    } catch (error) {

        console.error(error);
        res.status(500).json({
            error: "Database error"
        });

    }

});

// POST new user
app.post("/addUser", async (req, res) => {

    try {

        const { name, email } = req.body;

        const [result] = await db.query(
            "INSERT INTO users (name, email) VALUES (?, ?)",
            [name, email]
        );

        res.json({
            message: "User inserted successfully",
            id: result.insertId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Database error"
        });

    }

});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
