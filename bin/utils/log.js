const chalk = require("chalk");

const log = {};

[
  { name: "error", value: "red" },
  { name: "success", value: "green" },
  { name: "warning", value: "yellow" },
  { name: "default", value: "blue" },
].forEach((type) => {
  log[type.name] = (msg) => {
    console.log(chalk[type.value](msg));
  };
});

module.exports = log;
