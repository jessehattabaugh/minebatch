module.exports = pyramid;

function pyramid(type, x, y, z, height) {
  console.info('building a pyramid');
  var cmds = [];
  for (var i = 0; i < height; i++) {
    //console.log(`adding level ${i}`);

    var l = i * 2 - i;
    var yi = y + height - i;

    //var color = i % 15;
    var color = 0;

    cmds.unshift(`fill ${x - i} ${yi} ${z - i} ${x + l} ${yi} ${z - i} minecraft:${type} ${color}`);
    cmds.unshift(`fill ${x + i} ${yi} ${z - i} ${x + i} ${yi} ${z + l} minecraft:${type} ${color}`);
    cmds.unshift(`fill ${x + i} ${yi} ${z + i} ${x - i} ${yi} ${z + l} minecraft:${type} ${color}`);
    cmds.unshift(`fill ${x - i} ${yi} ${z + i} ${x - l} ${yi} ${z - i} minecraft:${type} ${color}`);
  }
  return cmds;
}
