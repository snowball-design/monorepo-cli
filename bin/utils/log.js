const chalk = require("chalk");

const log = {};

[
  { name: "error", value: "red" },
  { name: "succss", value: "green" },
  { name: "warning", value: "yellow" },
  { name: "defalut", value: "blue" },
].forEach((type) => {
  log[type.name] = (msg) => {
    console.log(chalk[type.value](msg));
  };
});

exports.module = { log };
