const path = require('path');
const fs = require('fs');
const shell = require('shelljs');

const actionContent = ({ ACTION, absolute }) =>
  `${`
import { createAction } from '${absolute ? '../../../@' : '@'}';

export default createAction('${ACTION}', () => {

});
`.trim()}\n`;

const action = (workingPath, ACTION, { absolute }) => {
  let cwd = workingPath;
  const currentFolder = path.basename(workingPath);
  if (currentFolder.indexOf('@') === 0) {
    cwd = path.resolve(cwd, 'actions');
    if (!fs.existsSync(cwd)) {
      fs.mkdirSync(cwd);
    }
  }
  const actionPath = path.resolve(cwd, `${ACTION}.js`);

  if (!fs.existsSync(actionPath)) {
    fs.writeFileSync(actionPath, actionContent({ ACTION, absolute }), 'utf8');
    shell.exec(`git add ${actionPath.replace(' ', '\\ ')}`);
  }
};

module.exports = (ACTIONs, opts) => {
  const cwd = process.cwd();
  ACTIONs.forEach(ACTION => {
    action(cwd, ACTION, opts);
  });
};
