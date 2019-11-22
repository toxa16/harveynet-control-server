function renderUsers(users) {
  const usernames = users.map(x => x.name);
  console.log(usernames);
}

/**
 * Controller class.
 */
function Controller() {
  const users = [];

  function broadcastUserConnected(username) {
    users.map(x => x.handlePeerConnected(username));
  }
  function broadcastUserDisconnected(username) {
    users.map(x => x.handlePeerDisconnected(username));
  }

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
}

module.exports = Controller;
