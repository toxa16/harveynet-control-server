const { Server } = require('http');

const wss = require('./wss');

const server = new Server((req, res) => {
  res.end('HarveyNet - Control Server (v0.0.3)');
});

server.on('upgrade', (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, ws => {
    wss.emit('connection', ws, req);
  });
});

module.exports = server;
