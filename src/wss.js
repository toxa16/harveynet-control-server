const WebSocket = require('ws');

const App = require('./app');

const wss = new WebSocket.Server({ noServer: true });

const machinesFixture = [
  {
    id: 'machine2',
    isOnline: false,
  },
  {
    id: 'machine1',
    isOnline: true,
  },
];

const app = new App();
//wss.on('connection', app.handleSocketConnect);
wss.on('connection', (ws, req) => {
  const { remotePort } = req.socket;
  console.log(`Client ${remotePort} connected.`);


  const action = {
    type: 'MACHINE_LIST_UPDATE',
    payload: {
      machines: machinesFixture,
    },
  };
  ws.send(JSON.stringify(action));


  ws.on('close', () => {
    console.log(`${remotePort} disconnected.`);
  });
});

module.exports = wss;
