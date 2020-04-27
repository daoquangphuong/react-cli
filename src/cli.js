const { program } = require('commander');
const com = require('./commands/com');

module.exports = function cli(input) {
  program
    .command('com <COMs...>')
    .description('Create a Component')
    .option('-a, --absolute', 'import module @ as absolute module')
    .action(com);

  program.parse(input);
};
