const express = require('express');
const httpProxy = require('http-proxy');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors({
  origin: 'http://localhost:4200', // Your Angular app's origin
}));

const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  selfHandleResponse: false,
});

app.use('/proxy', (req, res) => {
  // Proxy requests to the target URL
  proxy.web(req, res, { target: 'http://192.168.1.80' });
});

app.listen(port, () => {
  console.log(`Proxy server is running on http://localhost:${port}`);
});
