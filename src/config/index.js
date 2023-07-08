const devConfig = require("./dev.config");

module.exports = getConfig = () => {
    // find out what is the current environment and return the correct config object

    return devConfig;
};