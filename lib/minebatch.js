var Rcon = require('rcon');

var conn = new Rcon('localhost', 25575, 'neverminestraightdown');

function sendCommand() {
  console.log('Sending');
  if (commands.length == 0) {
    console.log('Out of commands');
    process.exit();
  }
  conn.send(commands.pop());
}

conn.on('auth', function() {
  console.log("Authed!");
  //sendCommand();
}).on('response', function () {
  console.log('Response');
  console.dir(arguments);
  //setTimeout(sendCommand, 500);
});

conn.connect();
