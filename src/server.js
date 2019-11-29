const { Server, ServerResponse } = require('http');
const cookie = require('cookie');

const wss = require('./wss');

const server = new Server((req, res) => {
  res.end('HarveyNet - Control Server (v0.0.3)');
});

function parseAuthCookies(cookieHeader) {
  if (!cookieHeader) {
    return null;
  }
  const cookies = cookie.parse(cookieHeader);
  const { username, machine_id } = cookies;
  if (!username && !machine_id) {
    return null;
  }
  return { username, machine_id };
}

server.on('upgrade', (req, socket, head) => {
  const res = new ServerResponse(req);
  res.assignSocket(socket);

  const authCookies = parseAuthCookies(req.headers.cookie)
  if (!authCookies) {
    res.statusCode = 401;
    return res.end();
  }

  const { username, machine_id } = authCookies;
  if (!username && !machine_id) {
    res.statusCode = 401;
    return res.end();
  }

  wss.handleUpgrade(req, socket, head, ws => {
    wss.emit('connection', ws, req);
  });
});

module.exports = server;
