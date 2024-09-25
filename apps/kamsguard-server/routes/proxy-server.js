const express = require('express');
const httpProxy = require('http-proxy');
const cors = require('cors');
const app = express();
const port = 5000;
// ws: true;


app.use(cors({
  origin: 'http://kamsguard-web.vercel.app', 
}));

const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  selfHandleResponse: false,
});


app.use((req, res, next) => {
  console.log(`Proxying request: ${req.method} ${req.url}`);
  next();
});


app.use('/proxy', (req, res) => {
  proxy.web(req, res, { target: 'http://192.168.1.70/display_pic.cgi?cam=1&res=hi&format=h264' }, (error) => {
    if (error) {
      console.error('Proxy error:', error);
      res.status(500).send('Proxy error');
    }
  });
});


app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

app.listen(port, () => {
  console.log(`Proxy server is running on http://localhost:${port}`);
});
