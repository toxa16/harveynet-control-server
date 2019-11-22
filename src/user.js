/**
 * User class.
 * @param {*} ws 
 * @param {*} username 
 * @param {*} controller 
 */
function User(ws, username, controller) {
  this.name = username;

  this.handlePeerConnected = name => {
    ws.send(`${name} connected.`);
  };

  this.handlePeerDisconnected = name => {
    ws.send(`Disconnected ${name}`);
  }
}

function renderUsers(users) {
  const usernames = users.map(x => x.name);
  console.log(usernames);
}

module.exports = User;
