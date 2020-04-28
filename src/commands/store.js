const path = require('path');
const fs = require('fs');
const shell = require('shelljs');

const indexContent = ({ module = '', absolute }) =>
  `${`
import { createStore } from '${absolute ? '../../@' : '@'}';

export const $value = createStore('${module}:value');
`.trim()}\n`;

const store = (workingPath, { absolute }) => {
  const cwd = workingPath;
  const currentFolder = path.basename(workingPath);
  if (currentFolder.indexOf('@') !== 0) {
    return;
  }
  const module = currentFolder.replace('@', '');
  const storePath = path.resolve(cwd, 'stores');
  if (!fs.existsSync(storePath)) {
    fs.mkdirSync(storePath);
  }
  const indexPath = path.resolve(storePath, 'index.js');
  if (!fs.existsSync(indexPath)) {
    fs.writeFileSync(indexPath, indexContent({ module, absolute }), 'utf8');
    shell.exec(`git add ${indexPath.replace(' ', '\\ ')}`);
  }
};

module.exports = opts => {
  const cwd = process.cwd();
  store(cwd, opts);
};
