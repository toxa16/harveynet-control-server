const ActionType = require('./action-type.enum');

/**
 * User machines fixture.
 */
const machinesStub = [
  {
    id: 'machine1',
    isOnline: true,
  },
  {
    id: 'machine2',
    isOnline: false,
  },
];

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
    const action = {
      type: ActionType.MACHINE_STATUS_CHANGE,
      payload: {
        machineId,
        isOnline: true,
      },
    };
    ws.send(JSON.stringify(action));
  }

  /**
   * Handles a Machine disconnect.
   */
  this.handleMachineDisconnect = machineId => {
    const action = {
      type: ActionType.MACHINE_STATUS_CHANGE,
      payload: {
        machineId,
        isOnline: false,
      },
    };
    ws.send(JSON.stringify(action));
  }

  /**
   * Sends machine list to client.
   */
  this.updateMachineList = machines => {
    const action = {
      type: ActionType.MACHINE_LIST_UPDATE,
      payload: {
        machines: machinesStub,
      },
    };
    ws.send(JSON.stringify(action));
  }
}

module.exports = User;
