const fs = require('fs');
const path = require('path');

const defaultConfig = {
  "absolute": false
};

const configPath = path.resolve(__dirname, 'config.json');

const setConfig = (data) => {
  fs.writeFileSync(configPath, JSON.stringify(data, null, 2), 'utf8');
};

if(!fs.existsSync(configPath)){
  setConfig(defaultConfig);
}

const getConfig = () => {
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
};

module.exports = {
  setConfig,
  getConfig
};
