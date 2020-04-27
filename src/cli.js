const { program } = require('commander');
const max = require('./commands/max');
const remove = require('./commands/remove');

module.exports = function cli(input) {
  program
    .command('max')
    .description('Find the folder/file max path')
    .option(
      '-s, --skip <file/folder>',
      'Skip file/folder',
      (v, p) => [...p, v],
      []
    )
    .action(max);

  program
    .command('rm <dir>')
    .description('Remove a particular folder/file')
    .option('-r, --recursive', 'Remove recursively')
    .action(remove);

  program.parse(input);
};
