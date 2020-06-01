const path = require('path');
const fs = require('fs');
const shell = require('shelljs');

const fix = workingPath => {
  const cwd = workingPath;

  const check = where => {
    const items = fs.readdirSync(where);
    items.forEach(item => {
      const itemPath = path.resolve(where, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        check(itemPath);
        return;
      }

      if (item !== 'index.js') {
        return;
      }

      const fileContent = fs.readFileSync(itemPath, 'utf8');
      const componentNameMatch = fileContent.match(/container\((.+?)\)/);
      if (!componentNameMatch) {
        return;
      }
      const componentName = componentNameMatch[1];
      const currentDir = path.basename(where);
      if (componentName === currentDir) {
        return;
      }
      const newFileContent = fileContent.replace(
        new RegExp(`${componentName}`, 'g'),
        currentDir
      );
      fs.writeFileSync(itemPath, newFileContent, 'utf8');
      shell.exec(`git add ${itemPath.replace(' ', '\\ ')}`);
    });
  };

  check(cwd);
};

module.exports = opts => {
  const cwd = process.cwd();
  fix(cwd, opts);
};
