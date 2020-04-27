const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

const remove = (dir, workingPath, opts) => {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(`CHECKING ${path.relative(process.cwd(), workingPath)}`);
  const dirs = fs.readdirSync(workingPath);
  dirs.forEach(item => {
    const itemPath = path.resolve(workingPath, item);
    const stats = fs.statSync(itemPath);
    if (item === dir) {
      shell.exec(`rm -rf ${itemPath}`);
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      console.info(`DELETED ${itemPath}`);
      process.stdout.write(
        `CHECKING ${path.relative(process.cwd(), workingPath)}`
      );
    } else if (opts.recursive && stats.isDirectory()) {
      remove(dir, itemPath, opts);
    }
  });
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
};

module.exports = (dir, opts) => {
  const cwd = process.cwd();
  remove(dir, path.resolve(cwd), opts);
  console.info('DONE');
};
