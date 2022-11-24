#!/usr/bin/env node
const fs = require("fs");
const fsp = fs.promises;
const path = require("path");
const commander = require("commander");
const program = commander.program;

const package = require("../package.json");
const { initCommand } = require("./command");

program.version(package.version);

program
  .command("init")
  .description("初始化项目模版")
  .alias("i")
  .action(() => {
    initCommand();
  });

program.parse(process.argv);
