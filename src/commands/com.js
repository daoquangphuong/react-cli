const path = require('path');
const fs = require('fs');

const containerContent = ({ absolute }) =>
  `
import { compose, hoc } from '${absolute ? '../../../@' : '@'}';

const container = compose(
  hoc(props => {
    return {
      ...props
    };
  })
);

export default container;
`.trim();

const indexContent = ({ COM }) =>
  `
import React from 'react';
import container from './container';

const ${COM} = props => {
  const { children } = props;
  return <div>{children}</div>;
};

export default container(${COM});
`.trim();

const com = (workingPath, COM, { absolute }) => {
  let cwd = workingPath;
  const currentFolder = path.basename(workingPath);
  if (currentFolder.indexOf('@') === 0) {
    cwd = path.resolve(cwd, 'components');
    if (!fs.existsSync(cwd)) {
      fs.mkdirSync(cwd);
    }
  }
  const comPath = path.resolve(cwd, COM);
  if (!fs.existsSync(comPath)) {
    fs.mkdirSync(comPath);
  }
  const indexPath = path.resolve(comPath, 'index.js');
  const containerPath = path.resolve(comPath, 'container.js');
  if (!fs.existsSync(containerPath)) {
    fs.writeFileSync(containerPath, containerContent({ absolute }), 'utf8');
  }
  if (!fs.existsSync(indexPath)) {
    fs.writeFileSync(indexPath, indexContent({ COM }), 'utf8');
  }
};

module.exports = (COMs, opts) => {
  const cwd = process.cwd();
  COMs.forEach(COM => {
    com(cwd, COM, opts);
  });
};
