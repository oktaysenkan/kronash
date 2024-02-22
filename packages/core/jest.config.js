// Just importing the config from jsconfig workspace and exporting it
const sharedConfig = require("@kronash/jest-config");

const config = {
  ...sharedConfig,
};

module.exports = config;
