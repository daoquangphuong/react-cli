const { program } = require('commander');
const fix = require('./commands/fix');
const com = require('./commands/com');
const store = require('./commands/store');
const action = require('./commands/action');

module.exports = function cli(input) {
  program
    .command('fix')
    .description('Fix')
    .action(fix);

  program
    .command('com <COMs...>')
    .description('Create Components')
    .option('-a, --absolute', 'import module @ as absolute module')
    .action(com);

  program
    .command('store')
    .description('Create Store')
    .option('-a, --absolute', 'import module @ as absolute module')
    .action(store);

  program
    .command('action <ACTIONs...>')
    .description('Create Actions')
    .option('-a, --absolute', 'import module @ as absolute module')
    .action(action);

  program.parse(input);
};
