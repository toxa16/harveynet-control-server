/**
 * User class.
 * @param {*} ws 
 * @param {*} username 
 * @param {*} controller 
 */
function User(ws, username, controller) {
  this.name = username;

  this.handlePeerConnected = name => {
    ws.send(`${name} connected.`);
  };

  this.handlePeerDisconnected = name => {
    ws.send(`Disconnected ${name}`);
  }

  /**
   * Handles new Machine connect.
   */
  this.handleMachineConnect = machineId => {
    ws.send(`Machine "${machineId}" connected.`);
  }

  /**
   * Handles a Machine disconnect.
   */
  this.handleMachineDisconnect = machineId => {
    ws.send(`Disconnected machine "${machineId}".`);
  }
}

module.exports = User;
