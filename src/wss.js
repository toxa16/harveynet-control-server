const WebSocket = require('ws');

const App = require('./app');

const wss = new WebSocket.Server({ noServer: true });

const app = new App();
//wss.on('connection', app.handleSocketConnect);
wss.on('connection', (ws, req) => {
  const { remotePort } = req.socket;
  console.log(`Client ${remotePort} connected.`);

  ws.on('close', () => {
    console.log(`${remotePort} disconnected.`);
  });
});

module.exports = wss;
