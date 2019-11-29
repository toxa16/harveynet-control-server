const http = require('http');
const { EventEmitter } = require('events');
const supertest = require('supertest');
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

  it('should just allow to connect (TO BE REMOVED)', async () => {
    const actionEmitter = new EventEmitter();

    user = new WebSocket(`${controlServerUrl}`);
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

  it.todo('should allow connection when the "username" cookie is set');
  it.todo('should allow connection when the "machine_id" cookie is set');

  it.skip('should return 101 on valid request', done => {
    /*supertest(server)
      .get('/')
      .set('Connection', 'Upgrade')
      .set('Upgrade', 'websocket')
      .set('Origin', 'http://localhost')
      .set('Sec-WebSocket-Key', 'AQIDBAUGBwgJCgsMDQ4PEC==')
      .set('Sec-WebSocket-Version', 13)
      .expect(101, done);*/
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/list',
      method: 'GET',
      headers: {
        'Connection': 'Upgrade',
        'Upgrade': 'websocket',
        'Origin': 'http://localhost',
        'Sec-WebSocket-Key': 'AQIDBAUGBwgJCgsMDQ4PEC==',
        'Sec-WebSocket-Version': '13',
      }
    };
    const req = http.request(options, res => {
      expect(res.statusCode).toBe(101);
      req.abort();
      done();
    });
  });
});
