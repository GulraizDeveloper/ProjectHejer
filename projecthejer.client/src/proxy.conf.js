const { env } = require('process');
// Use the exact port from launchSettings.json
const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
  env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'https://localhost:7064';

console.log('Proxy target:', target);

const PROXY_CONFIG = [
  {
    context: [
      "/weatherforecast",
      "/api",
      "/swagger"
    ],
    target,
    secure: false,
    headers: {
      Connection: 'Keep-Alive'
    },
    logLevel: "debug",
    changeOrigin: true,
    onError: function (err, req, res) {
      console.log('Proxy Error:', err);
    },
    onProxyReq: function (proxyReq, req, res) {
      console.log('Proxying request to:', target + req.url);
    }
  }
]

module.exports = PROXY_CONFIG;
