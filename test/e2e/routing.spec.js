const { EventEmitter } = require('events');
const WebSocket = require('ws');

const port = process.env.PORT || 3000;
const controlServerUrl = `ws://localhost:${port}`;  // env

/**
 * Closes a WebSocket connection if opened.
 * @param {*} socket 
 */
function socketSafeClose(socket) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
  }
  socket && socket.on('open', () => {
    socket.close();
  });
}

describe('Routing', () => {
  let user;
  let machine;

  afterEach(() => {
    socketSafeClose(user);
    socketSafeClose(machine);
  });

  it('should allow connection when the "username" cookie is set', async () => {
    const actionEmitter = new EventEmitter();

    user = new WebSocket(`${controlServerUrl}`, {
      headers: {
        'Cookie': 'username=charlie',
      },
    });
    user.on('open', () => {
      actionEmitter.emit('open', true);
    });

    let isOpened = false;
    isOpened = await new Promise(resolve => {
      actionEmitter.on('open', resolve);
    });
    // TIMEOUT if not connecting
    expect(isOpened).toBe(true);
  });

  it('should allow connection when the "machine_id" cookie is set', async () => {
    const actionEmitter = new EventEmitter();

    user = new WebSocket(`${controlServerUrl}`, {
      headers: {
        'Cookie': 'machine_id=machine1',
      },
    });
    user.on('open', () => {
      actionEmitter.emit('open', true);
    });

    let isOpened = false;
    isOpened = await new Promise(resolve => {
      actionEmitter.on('open', resolve);
    });
    // TIMEOUT if not connecting
    expect(isOpened).toBe(true);
  });

  it(
    'shouldn\'t allow connection when no "username" nor "machine_id" cookie is set',
    async () => {
      const actionEmitter = new EventEmitter();

      user = new WebSocket(`${controlServerUrl}`);
      user.on('error', (err) => {
        actionEmitter.emit('wsError', err);
      });

      let error = null;
      error = await new Promise(resolve => {
        actionEmitter.on('wsError', resolve);
      });
      // TIMEOUT if no ws 'error' event fired
      expect(error).toBeTruthy();
    },
  )
});
