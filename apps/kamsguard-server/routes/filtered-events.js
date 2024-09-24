require('dotenv-mono').load(); 
const { Router } = require('express');
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const { parse } = require('csv-parse');

const route = Router();

const app = express();
const port = 3300;

app.use(
    cors({
        origin: 'https://kamsguard-web.vercel.app', 
    })
);

route.get('/events', async (req, res) => {
    try {
       
        const response = await fetch('http://192.168.1.70/events.cgi?format=csv&time=1724395308', {
            headers: {
                Authorization: 'Basic ' + Buffer.from(`${process.env.CGI_USERNAME}:${process.env.CGI_PASSWORD}`).toString('base64')
            }
        });

        
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('text/plain')) {
            const csvText = await response.text();

            const records = [];
            const parser = parse(csvText, {
                delimiter: ',', 
                trim: true,    
                skip_empty_lines: true,
                columns: true,  
            });

         
            parser.on('readable', function () {
                let record;
                while ((record = parser.read()) !== null) {
                    records.push(record);
                    console.log(record);
                }
            });

          
            parser.on('error', function (err) {
                console.error('Error parsing CSV:', err.message);
                res.status(500).json({ error: 'Failed to parse CSV data' });
            });

            parser.on('end', function () {
                if (records.length > 0) {
                    res.json(records);
                } else {
                    res.status(500).json({ error: 'No records found in the CSV data' });
                }
            });

            parser.write(csvText);
            parser.end();
        } else {
            const text = await response.text();
            console.error('Response is not text/plain:', text);
            res.status(500).json({ error: `Expected text/plain response but received a different format: ${contentType}` });
        }
    } catch (error) {
        console.error("Error fetching or processing events:", error);
        res.status(500).json({ error: 'Failed to fetch or process events' });
    }
});

app.listen(port, () => {
    console.log(`Event API running at http://localhost:${port}`);
});


module.exports = route;