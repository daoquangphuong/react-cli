const path = require('path');
const fs = require('fs');
const shell = require('shelljs');

const fix = (workingPath, { com, store } = {}) => {
  const cwd = workingPath;

  if (!com && !store) {
    throw new Error('Missing type = "com" or "store"');
  }

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

      const currentDir = path.basename(where);

      const storageNameMatch = fileContent.match(/createStore\((.+?)\)/);
      let newFileContent = fileContent;

      if (storageNameMatch && currentDir === 'stores' && store) {
        const nameMatchList = newFileContent.match(
          /const\s+\$(.+?)\s+=\s+createStore\((.+?)\)/g
        );

        const parentDirName = path.basename(path.resolve(where, '../'));

        nameMatchList.forEach(text => {
          const nameMatch = text.match(
            /const\s+\$(.+?)\s+=\s+createStore\((['"].+?['"])[,)]/
          );

          const moduleName =
            parentDirName[0] === '@'
              ? parentDirName.substring(1)
              : parentDirName;

          const firstComma = nameMatch[2][0];
          const lastComma = nameMatch[2][nameMatch[2].length - 1];

          const storeName = `${firstComma}${moduleName}:${nameMatch[1]}${lastComma}`;

          if (storeName !== nameMatch[2]) {
            newFileContent = newFileContent.replace(
              nameMatch[0].substring(0, nameMatch[0].length - 1),
              `const $${nameMatch[1]} = createStore(${storeName}`
            );
          }
        });

        if (newFileContent !== fileContent) {
          fs.writeFileSync(itemPath, newFileContent, 'utf8');
          shell.exec(`git add ${itemPath.replace(' ', '\\ ')}`);
        }

        return;
      }
      const componentNameMatch = fileContent.match(/container\((.+?)\)/);
      if (!componentNameMatch || !com) {
        return;
      }
      const componentName = componentNameMatch[1];
      if (componentName === currentDir) {
        return;
      }
      newFileContent = fileContent.replace(
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
