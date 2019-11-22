function renderUsers(users) {
  const usernames = users.map(x => x.name);
  console.log(usernames);
}

function logMachines(machines) {
  const machineIds = [];
  machines.forEach(x => machineIds.push(x.id));
  console.log(machineIds);
}

/**
 * Controller class.
 */
function Controller() {
  const users = [];
  const machines = new Set();

  function broadcastUserConnected(username) {
    users.map(x => x.handlePeerConnected(username));
  }
  function broadcastUserDisconnected(username) {
    users.map(x => x.handlePeerDisconnected(username));
  }

  /**
   * Handles new User connection
   */
  this.handleUserConnect = user => {
    // log message
    console.log(`User ${user.name} connected.`);
    // notifying other users about connected peer
    // (before registering the target user)
    broadcastUserConnected(user.name);
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
    console.log(`Disconnected user ${user.name}`);
    // remembering the user name
    const username = user.name;
    // unregistering the user
    const index = users.indexOf(user);
    users.splice(index, 1);
    // logging current users
    renderUsers(users);
    // notifying other users about disconnected peer
    // (after deleting the target user)
    broadcastUserDisconnected(username);
  };

  /**
   * Handles new Machine connection.
   */
  this.handleMachineConnect = machine => {
    console.log(`Machine ${machine.id} connected.`);
    // registering new machine
    machines.add(machine);
    // logging machines
    logMachines(machines);
  }

  /**
   * Handles a Machine disconnect.
   */
  this.handleMachineDisconnect = machine => {
    console.log(`Disconnected machine ${machine.id}.`);
    // unregistering the machine
    machines.delete(machine);
    // logging machines
    logMachines(machines);
  }
}

module.exports = Controller;
