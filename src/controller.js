function logUsers(users) {
  const usernames = [];
  users.forEach(x => usernames.push(x.username));
  console.log('\tUsers:', usernames);
}

function logMachines(machines) {
  const machineIds = [];
  machines.forEach(x => machineIds.push(x.id));
  console.log('\tMachines:', machineIds);
}

/**
 * Controller class.
 */
function Controller() {
  const users = new Set();
  const machines = new Set();

  function broadcastMachineConnected(machineId) {
    users.forEach(x => x.handleMachineConnect(machineId));
  }
  function broadcastMachineDisconnected(machineId) {
    users.forEach(x => x.handleMachineDisconnect(machineId));
  }
  function sendCurrentMachinesToUser(user) {
    machines.forEach(x => user.handleMachineConnect(x.id));
  }

  /**
   * Handles new User connection
   */
  this.handleUserConnect = user => {
    // log message
    console.log(`User "${user.username}" connected.`);
    // registering new user
    users.add(user);
    // logging current users
    logUsers(users);
    // notifying the user about currently connected machines
    sendCurrentMachinesToUser(user);
  };

  /**
   * Handles a User disconnect.
   */
  this.handleUserDisconnect = user => {
    // log message
    console.log(`Disconnected user "${user.username}".`);
    // unregistering the user
    users.delete(user);
    // logging current users
    logUsers(users);
  };

  /**
   * Handles new Machine connection.
   */
  this.handleMachineConnect = machine => {
    console.log(`Machine "${machine.id}" connected.`);
    // registering new machine
    machines.add(machine);
    // logging machines
    logMachines(machines);
    // broadcasting machine connect
    broadcastMachineConnected(machine.id);
  }

  /**
   * Handles a Machine disconnect.
   */
  this.handleMachineDisconnect = machine => {
    console.log(`Disconnected machine "${machine.id}".`);
    // unregistering the machine
    machines.delete(machine);
    // logging machines
    logMachines(machines);
    // broadcasting machine disconnect
    broadcastMachineDisconnected(machine.id);
  }
}

module.exports = Controller;
