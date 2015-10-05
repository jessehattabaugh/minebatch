#! /usr/bin/env node

var argv = require('yargs')
  .usage("Usage: $0 [options]")
  .option('h', {
    description: "the address of the Minecraft server to connect to",
    default: 'localhost',
    alias: 'host'
  })
  .option('P', {
    description: "the rcon.port configured in the server's server.properties file",
    default: 25575,
    alias: 'port'
  })
  .option('p', {
    description: "the rcon.password configured in the server's server.properties file",
    alias: 'pass',
    demand: true
  })
  .option('?', {
    alias: 'help',
    description: "display help message"
  })
  .help('help')
  .version('0.0.0', 'version', "display version information")
  .example('minebatch < example/commands.js', "pipe a file of commands to your locally hosted Minecraft Server")
  .epilog('for more information visit https://github.com/jessehattabaugh/minebatch')
  .argv;

// the parsed data is stored in argv.
//console.log(argv);

var commands = [];

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(data) {
  console.info('Recieving piped commands');
  commands = commands.concat(data.split(/\n/));
});

var Rcon = require('rcon');
var conn = new Rcon(argv.host, argv.port, argv.pass);

conn.on('auth', function() {
  console.info("Connected to server");
  sendCommand();
}).on('response', function () {
  console.info("Server responded");
  console.dir(arguments);
  setTimeout(sendCommand, 500);
});

conn.connect();

function sendCommand() {
  console.info("Sending a command");
  if (commands.length == 0) {
    console.info("Out of commands");
    process.exit();
  }
  conn.send(commands.shift());
}
