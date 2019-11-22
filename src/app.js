const url = require('url');

const Controller = require('./controller');
const User = require('./user');

/**
 * Application class.
 */
function App() {
  this.controller = new Controller();

  this.handleSocketConnect = (ws, req) => {
    const { query } = url.parse(req.url, true);
    const { username, machine_id } = query;

    const name = username || machine_id;

    const user = new User(ws, name, this.controller);
    this.controller.handleUserConnect(user);
    ws.on('close', () => {
      this.controller.handleUserDisconnect(user);
    });
  };
}

module.exports = App;
