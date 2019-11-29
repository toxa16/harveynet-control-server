const server = require('./server');

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log('harveynet control server listening on port '
    + server.address().port + '...');
});
