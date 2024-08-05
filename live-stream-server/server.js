const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3001; // Correct port

app.use(cors({
  origin: 'http://localhost:4200', // Your Angular app's origin
}));

// Serve static files if needed
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
