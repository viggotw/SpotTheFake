// server.js

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to save logs
app.post('/log', (req, res) => {
    const logData = req.body;
    const logFileName = `game_log_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "_")}.jsonl`;

    const folderPath = path.join(__dirname, 'logs');
    const logFilePath = path.join(folderPath, logFileName);

    // Convert log entries to JSONL format
    const jsonlContent = logData.map(logEntry => JSON.stringify(logEntry)).join('\n');

    // Create a folder for logs if it doesn't exist
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
        console.log('Log folder created:', folderPath);
    }

    // Write the log to disk
    fs.appendFile(logFilePath, jsonlContent + '\n', (err) => {
        if (err) {
            console.error('Error writing log to disk:', err);
            return res.status(500).send('Failed to save log');
        }
        console.log('Log saved:', logFilePath);
        res.send('Log saved');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
