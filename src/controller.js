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
 * User machines fixture.
 */
const ownershipFixture = [
  {
    username: 'alice',
    machines: [
      { id: 'machine1' },
      { id: 'machine2' },
    ]
  },
  {
    username: 'bob',
    machines: [
      { id: 'machine3' },
    ],
  },
];

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
  function registerUser(user) {
    // log message
    console.log(`User "${user.username}" connected.`);
    // registering new user
    users.add(user);
    // logging current users
    logUsers(users);
  }

  /**
   * Handles new User connection.
   */
  this.handleUserConnect = user => {
    registerUser(user);
    // notifying the user about currently connected machines
    sendCurrentMachinesToUser(user);
  };

  this.handleUserConnectToList = user => {
    registerUser(user);
    // send user machines
    const ownership = ownershipFixture
      .find(x => x.username === user.username);
    const machines = ownership ? ownership.machines : [];
    user.updateMachineList(machines);
  }

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
