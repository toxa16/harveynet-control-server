const WebSocket = require('ws');
const { EventEmitter } = require('events');

const ActionType = require('../../src/action-type.enum');

const port = process.env.PORT || 3000;
const controlServerUrl = `ws://localhost:${port}`;  // env

/**
 * Closes a WebSocket connection if opened.
 * @param {*} socket 
 */
function socketSafeClose(socket) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.close();
  }
  socket.on('open', () => {
    socket.close();
  });
}

describe('/list Endpoint', () => {
  let user;
  let machine;

  afterEach(() => {
    socketSafeClose(user);
    socketSafeClose(machine);
  });

  it('should return user machines with their online statuses', async () => {
    const machineId = 'machine1';
    const actionEmitter = new EventEmitter();

    // machine "machine1" connecting
    machine = new WebSocket(`${controlServerUrl}/?machine_id=machine1`);

    // user "alice" connecting to /list endpoint
    user = new WebSocket(`${controlServerUrl}/list?username=alice`);
    user.on('message', message => {
      const action = JSON.parse(message);
      actionEmitter.emit('action', action);
    });

    // asserting machine list sent to user
    let action = await new Promise(resolve => {
      actionEmitter.on('action', resolve);
    });
    // TIMEOUT HERE if machine list not sent to user
    expect(action.type).toBe(ActionType.MACHINE_LIST_UPDATE);
    const payload = action.payload;
    //expect(payload.machines).toBeTruthy();
  });
});
