const WebSocket = require('ws');
const { EventEmitter } = require('events');

const ActionType = require('../../src/action-type.enum');

const port = process.env.PORT || 3000;
const controlServerUrl = `ws://localhost:${port}`;  // env

function socketSafeClose(socket) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.close();
  }
  socket.on('open', () => {
    socket.close();
  });
}

describe('Online Status', () => {
  let user;
  let machine;

  afterEach(() => {
    socketSafeClose(user);
    socketSafeClose(machine);
  });

  it('should update machine online status for a user', async () => {
    const machineId = 'machine1';
    const actionEmitter = new EventEmitter();

    // user connecting
    user = new WebSocket(`${controlServerUrl}/?username=alice`);
    user.on('message', message => {
      const action = JSON.parse(message);
      actionEmitter.emit('action', action);
    });

    // machine connecting
    machine = new WebSocket(`${controlServerUrl}/?machine_id=${machineId}`);

    // asserting "online" status sent to user
    let action = await new Promise(resolve => {
      actionEmitter.on('action', resolve);
    });
    // TIMEOUT HERE if machine "online" status change not sent to user
    expect(action.type).toBe(ActionType.MACHINE_STATUS_CHANGE);
    expect(action.payload.isOnline).toBe(true);
    expect(action.payload.machineId).toBe(machineId);
    
    // machine disconnecting
    socketSafeClose(machine);

    // asserting "offline" status sent to user
    action = await new Promise(resolve => {
      actionEmitter.on('action', resolve);
    });
    // TIMEOUT HERE if machine "offline" status change not sent to user
    expect(action.type).toBe(ActionType.MACHINE_STATUS_CHANGE);
    expect(action.payload.isOnline).toBe(false);
    expect(action.payload.machineId).toBe(machineId);
  });

  it(
    'should notify newly connected user about currently connected machines',
    async () => {
      const machineId = 'machine1';
      const actionEmitter = new EventEmitter();

      // machine connecting
      machine = new WebSocket(`${controlServerUrl}/?machine_id=${machineId}`);

      // user connecting
      user = new WebSocket(`${controlServerUrl}/?username=alice`);
      user.on('message', message => {
        const action = JSON.parse(message);
        actionEmitter.emit('action', action);
      });

      // asserting user is notified about machine1 being connected
      let action = await new Promise(resolve => {
        actionEmitter.on('action', resolve);
      });
      // TIMEOUT HERE if machine "online" status not sent to user
      expect(action.type).toBe(ActionType.MACHINE_STATUS_CHANGE);
      expect(action.payload.isOnline).toBe(true);
      expect(action.payload.machineId).toBe(machineId);
    },
  );
});
