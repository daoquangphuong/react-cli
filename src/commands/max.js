const fs = require('fs');
const path = require('path');

const max = (workingPath, opts, res) => {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(`CHECKING ${path.relative(process.cwd(), workingPath)}`);
  const depth = workingPath.split(path.sep).length;
  if (depth > res.depth) {
    res.depth = depth;
    res.path = workingPath;
  }
  const dirs = fs.readdirSync(workingPath);
  dirs.forEach(item => {
    if (opts.skipMap[item]) {
      return;
    }
    const itemPath = path.resolve(workingPath, item);
    const stats = fs.statSync(itemPath);
    if (stats.isDirectory()) {
      max(itemPath, opts, res);
    }
  });
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
};

module.exports = opts => {
  opts.skipMap = opts.skip.reduce((map, item) => {
    map[item] = true;
    return map;
  }, {});
  const cwd = process.cwd();
  const res = { depth: 0, path: '' };
  max(path.resolve(cwd), opts, res);
  console.info(`MAX ${JSON.stringify(res, null, 2)}`);
};
