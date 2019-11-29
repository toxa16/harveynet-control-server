const WebSocket = require('ws');

const App = require('./app');

const wss = new WebSocket.Server({ noServer: true });

const app = new App();
wss.on('connection', app.handleSocketConnect);

module.exports = wss;
