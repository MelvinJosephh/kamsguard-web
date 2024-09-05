require('dotenv-mono').load(); // Load environment variables from .env file

const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const { parse } = require('csv-parse');

const app = express();
const port = 3300;

app.use(
    cors({
        origin: 'http://localhost:4200', 
    })
);

// API endpoint to fetch and list the CSV data as JSON
app.get('/events', async (req, res) => {
    try {
        // Fetch the data from the CGI endpoint
        const response = await fetch('http://192.168.1.70/events.cgi?format=csv&time=1724395308', {
            headers: {
                Authorization: 'Basic ' + Buffer.from(`${process.env.CGI_USERNAME}:${process.env.CGI_PASSWORD}`).toString('base64')
            }
        });

        // Check if the response is in text format
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('text/plain')) {
            const csvText = await response.text();

            // Initialize the parser
            const records = [];
            const parser = parse(csvText, {
                delimiter: ',', 
                trim: true,    
                skip_empty_lines: true,
                columns: true,  
            });

            // Handle the data as it's parsed
            parser.on('readable', function () {
                let record;
                while ((record = parser.read()) !== null) {
                    records.push(record);
                    console.log(record);
                }
            });

            // Catch any errors
            parser.on('error', function (err) {
                console.error('Error parsing CSV:', err.message);
                res.status(500).json({ error: 'Failed to parse CSV data' });
            });

            // Handle end of parsing
            parser.on('end', function () {
                if (records.length > 0) {
                    // Send the parsed events data as the response
                    res.json(records);
                } else {
                    res.status(500).json({ error: 'No records found in the CSV data' });
                }
            });

            // Start parsing
            parser.write(csvText);
            parser.end();
        } else {
            // Log and send a response if the content type is not as expected
            const text = await response.text();
            console.error('Response is not text/plain:', text);
            res.status(500).json({ error: `Expected text/plain response but received a different format: ${contentType}` });
        }
    } catch (error) {
        console.error("Error fetching or processing events:", error);
        res.status(500).json({ error: 'Failed to fetch or process events' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Event API running at http://localhost:${port}`);
});
