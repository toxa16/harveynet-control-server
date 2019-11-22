const WebSocket = require('ws');
const { EventEmitter } = require('events');

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
  let controller;
  let machine;

  afterEach(() => {
    socketSafeClose(controller);
    socketSafeClose(machine);
  });

  it('should update machine online status for a controller', async () => {
    const machineId = 'machine1';
    const actionEmitter = new EventEmitter();

    // controller connecting
    controller = new WebSocket(`${controlServerUrl}/?username=alice`);
    controller.on('message', message => {
      const action = JSON.parse(message);
      actionEmitter.emit('action', action);
    });

    // machine connecting
    machine = new WebSocket(`${controlServerUrl}/?machine_id=${machineId}`);

    // asserting "online" status sent to controller
    let action = await new Promise(resolve => {
      actionEmitter.on('action', resolve);
    });
    // TIMEOUT HERE if machine "online" status change not sent to controller
    expect(action.type).toBe('MACHINE_STATUS_CHANGE');
    expect(action.payload.isOnline).toBe(true);
    expect(action.payload.machineId).toBe(machineId);
    
    // machine disconnecting
    socketSafeClose(machine);

    // asserting "offline" status sent to controller
    action = await new Promise(resolve => {
      actionEmitter.on('action', resolve);
    });
    // TIMEOUT HERE if machine "offline" status change not sent to controller
    expect(action.type).toBe('MACHINE_STATUS_CHANGE');
    expect(action.payload.isOnline).toBe(false);
    expect(action.payload.machineId).toBe(machineId);
  });
});
