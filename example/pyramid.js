#! /usr/bin/env node

var argv = require('yargs')
  .usage("Usage: $0 [options]")
  .option('t', {
    description: "the type of block to build the pyramid out of",
    default: 'stone',
    alias: 'type'
  })
  .option('h', {
    alias: 'height',
    description: "the height of the pyramid",
    default: 255,
  })
  .option('x', {
    description: "x coordinate of the center of the pyramid",
    default: 0
  })
  .option('y', {
    description: "y coordinate of the center of the pyramid",
    default: 0
  })
  .option('z', {
    description: "z coordinate of the center of the pyramid",
    default: 0
  })
  .example('node pyramid.js -t sandstone -h 256 -x 0 -y 0 -z 255', "output commands for building a pyramid 256 blocks high made out of sandstone")
  .epilog('for more information visit https://github.com/jessehattabaugh/minebatch')
  .argv;

for (var i = 0; i < argv.height; i++) {

  var l = i * 2 - i;
  var yi = argv.y + argv.height - i;

  console.log(`fill ${argv.x - i} ${yi} ${argv.z - i} ${argv.x + l} ${yi} ${argv.z - i} minecraft:${argv.type}`);
  console.log(`fill ${argv.x + i} ${yi} ${argv.z - i} ${argv.x + i} ${yi} ${argv.z + l} minecraft:${argv.type}`);
  console.log(`fill ${argv.x + i} ${yi} ${argv.z + i} ${argv.x - i} ${yi} ${argv.z + l} minecraft:${argv.type}`);
  console.log(`fill ${argv.x - i} ${yi} ${argv.z + i} ${argv.x - l} ${yi} ${argv.z - i} minecraft:${argv.type}`);
}
