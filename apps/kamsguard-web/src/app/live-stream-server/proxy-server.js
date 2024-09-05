const express = require('express');
const httpProxy = require('http-proxy');
const cors = require('cors');
const app = express();
const port = 5000;
// ws: true;

// Enable CORS for requests from Angular app
app.use(cors({
  origin: 'http://localhost:4200', // Adjust to match the origin of your Angular app
}));

const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  selfHandleResponse: false,
});

// Middleware to log request details (optional)
app.use((req, res, next) => {
  console.log(`Proxying request: ${req.method} ${req.url}`);
  next();
});

// Proxy requests to the target URL
app.use('/proxy', (req, res) => {
  proxy.web(req, res, { target: 'http://192.168.1.70/display_pic.cgi?cam=1&res=hi&format=h264' }, (error) => {
    if (error) {
      console.error('Proxy error:', error);
      res.status(500).send('Proxy error');
    }
  });
});

// Handle 404 errors for proxy routes
app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

app.listen(port, () => {
  console.log(`Proxy server is running on http://localhost:${port}`);
});
