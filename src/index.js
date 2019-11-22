const { Server } = require('http');
const WebSocket = require('ws');

const App = require('./app');

const server = new Server((req, res) => {
  res.end('HarveyNet - Control Server (v0.0.2)');
});

const wss = new WebSocket.Server({ server });

const app = new App();

wss.on('connection', app.handleSocketConnect);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log('harveynet control server listening on port '
    + server.address().port + '...');
});
