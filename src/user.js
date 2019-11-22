/**
 * User class.
 * @param {*} ws 
 * @param {*} username 
 * @param {*} controller 
 */
function User(ws, username, controller) {
  this.username = username;

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
