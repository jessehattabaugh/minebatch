#! /usr/bin/env node
const chalk = require('chalk');
const info = chalk.cyan;
const server = chalk.italic.gray;

const argv = require('yargs')
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
  .option('d', {
    description: "the number of milliseconds to wait before sending the next command. sometimes sending commands too fast can crash a server",
    alias: 'delay',
    default: 500
  })
  .option('?', {
    alias: 'help',
    description: "display help message"
  })
  .help('help')
  .version('0.0.1', 'version', "display version information")
  .example('minebatch < example/commands.txt', "pipe a file of commands to your locally hosted Minecraft Server")
  .epilog('for more information visit https://github.com/jessehattabaugh/minebatch')
  .argv;

let commands = [];

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(data) {
  console.info(chalk.gray('Recieving piped commands'));
  commands = commands.concat(data.split(/\n/));
});

const Rcon = require('rcon');
const conn = new Rcon(argv.host, argv.port, argv.pass);

conn.on('auth', function() {
  console.info(chalk.green("Connected to server"));
  sendCommand();
}).on('response', function (res) {
  console.info(chalk.magenta("Server responded: ") + chalk.gray(res));
  setTimeout(sendCommand, argv.delay);
});

conn.connect();

function sendCommand() {
  if (commands.length == 0) {
    console.info(chalk.yellow("Out of commands"));
    process.exit();
    return;
  }
  const cmd = commands.shift();
  console.info(chalk.cyan("Sending a command: ") + chalk.gray(cmd));
  conn.send(cmd);
}
