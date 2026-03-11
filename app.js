const express = require('express');
const add = require('./math');

function createApp() {
  const app = express();

  // Root route
  app.get('/', (req, res) => {
    const sum = add(2, 5);
    res.send(`<html><body><h1 id="result">Sum is: ${sum}</h1></body></html>`);
  });

  return app;
}

function startServer(port = 8080, host = '127.0.0.1') {
  const app = createApp();
  const server = app.listen(port, host, () => {
    const address = server.address();
    const boundPort = typeof address === 'object' && address ? address.port : port;
    console.log(`Server running on http://${host}:${boundPort}`);
  });
  return server;
}

if (require.main === module) {
  startServer(8080, '0.0.0.0');
}

module.exports = { createApp, startServer };
