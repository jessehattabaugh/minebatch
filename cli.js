#! /usr/bin/env node
import chalk from 'chalk';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import Rcon from 'rcon';

// configure the command line interface
const { host, port, pass } = yargs(hideBin(process.argv))
	.epilog('for more information visit https://github.com/jessehattabaugh/minebatch')
	.example(
		'minebatch -p PASSWORD < example/commands.txt',
		'pipe a file of commands to your locally hosted Minecraft Server',
	)
	.option('h', {
		description: 'the address of the Minecraft server to connect to',
		default: '127.0.0.1',
		alias: 'host',
	})
	.option('P', {
		description: "the rcon.port configured in the server's server.properties file",
		default: 25575,
		alias: 'port',
	})
	.option('p', {
		description: "the rcon.password configured in the server's server.properties file",
		alias: 'pass',
		demand: true,
	})
	.option('d', {
		description:
			'the number of milliseconds to wait before sending the next command. sometimes sending commands too fast can crash a server',
		alias: 'delay',
		default: 500,
	})
	.option('?', {
		alias: 'help',
		description: 'display help message',
	})
	.usage('Usage: $0 [options]')
	.parse();

// read the commands from stdin and enqueue them
let commands = [];
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', (data) => {
	console.info(chalk.gray('Recieving piped commands'));
	commands = commands.concat(data.split(/\n/));
});

// connect to the server and send commands
const conn = new Rcon(host, port, pass);
function sendCommand() {
	if (commands.length == 0) {
		console.warn(chalk.yellow('Out of commands'));
		process.exit();
	}
	const cmd = commands.shift();
	console.info(chalk.cyan('Sending a command: ') + chalk.gray(cmd));
	conn.send(cmd);
}
conn.on('auth', () => {
	console.info(chalk.green('Connected to server'));
	sendCommand();
}).on('response', (res) => {
	console.info(chalk.magenta('Server responded: ') + chalk.gray(res));
	setTimeout(sendCommand, argv.delay);
}).on('error', (msg) => {
	console.error(chalk.red('Error: ') + chalk.gray(msg));
	process.exit(1);
});
conn.connect();
