const { program } = require('commander');
const fix = require('./commands/fix');
const com = require('./commands/com');
const store = require('./commands/store');

module.exports = function cli(input) {
  program
    .command('fix')
    .description('Fix')
    .action(fix);

  program
    .command('com <COMs...>')
    .description('Create a Component')
    .option('-a, --absolute', 'import module @ as absolute module')
    .action(com);

  program
    .command('store')
    .description('Create a Component')
    .option('-a, --absolute', 'import module @ as absolute module')
    .action(store);

  program.parse(input);
};
