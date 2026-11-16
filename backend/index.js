

const express = require('express');
const pool = require('./db');

const app = express();
const PORT = 5000;

app.use(express.json());

// Home route
app.get('/', (req, res) => {
    res.send('Labour Management System Backend is Running!');
});

// Test database connection
app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({
            message: 'PostgreSQL Connected Successfully!',
            time: result.rows[0].now
        });
    } catch (error) {
        console.error('TEST DB ERROR:', error);
        res.status(500).json({
            message: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
