const url = require('url');

const Controller = require('./controller');
const Machine = require('./machine');
const User = require('./user');

/**
 * Application class.
 */
function App() {
  this.controller = new Controller();

  this.handleSocketConnect = (ws, req) => {
    const { query } = url.parse(req.url, true);
    const { username, machine_id } = query;

    if (username) {
      const user = new User(ws, username, this.controller);
      this.controller.handleUserConnect(user);
      ws.on('close', () => {
        this.controller.handleUserDisconnect(user);
      });
    } else if (machine_id) {
      const machine = new Machine(ws, machine_id, this.controller);
      this.controller.handleMachineConnect(machine);
      ws.on('close', () => {
        this.controller.handleMachineDisconnect(machine);
      });
    } else {
      ws.send('Control Server: Error - unrecognized connection.');
      ws.close();
    }
  };
}

module.exports = App;
