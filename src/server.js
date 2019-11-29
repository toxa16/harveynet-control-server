const { Server, ServerResponse } = require('http');
const cookie = require('cookie');

const wss = require('./wss');

const server = new Server((req, res) => {
  res.end('HarveyNet - Control Server (v0.0.3)');
});

server.on('upgrade', (req, socket, head) => {
  const res = new ServerResponse(req);
  res.assignSocket(socket);

  const cookieHeader = req.headers.cookie;
  const cookies = cookie.parse(cookieHeader);
  const { username, machine_id } = cookies;

  if (!username && !machine_id) {
    res.statusCode = 401;
    res.end();
  } else {
    wss.handleUpgrade(req, socket, head, ws => {
      wss.emit('connection', ws, req);
    });
  }
});

module.exports = server;
