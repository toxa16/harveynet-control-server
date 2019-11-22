function renderUsers(users) {
  const usernames = users.map(x => x.name);
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
  const users = [];
  const machines = new Set();

  function broadcastMachineConnected(machineId) {
    users.map(x => x.handleMachineConnect(machineId));
  }
  function broadcastMachineDisconnected(machineId) {
    users.map(x => x.handleMachineDisconnect(machineId));
  }

  /**
   * Handles new User connection
   */
  this.handleUserConnect = user => {
    // log message
    console.log(`User "${user.name}" connected.`);
    // registering new user
    users.push(user);
    // logging current users
    renderUsers(users);
  };

  /**
   * Handles a User disconnect.
   */
  this.handleUserDisconnect = user => {
    // log message
    console.log(`Disconnected user "${user.name}"`);
    // unregistering the user
    const index = users.indexOf(user);
    users.splice(index, 1);
    // logging current users
    renderUsers(users);
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
